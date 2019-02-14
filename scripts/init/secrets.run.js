'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const { PATH_SECRETS, PATH_SSH } = require('../config');
const secretsMap = require('../config/secretsMap');
const terminal = require('../helpers/terminal');
const logger = require('../helpers/logger');

const pubCertRegex = /\.pub$/;

const askCertificateSaveLocation = () =>
  logger.textInput('Save as:', path.resolve(PATH_SSH, 'id_rsa'));

const initSecrets = async () => {
  let secrets = {};

  logger.title('Secrets Configuration');
  logger.info(
    `These values will be saved as:
    ${PATH_SECRETS}

    which is not git tracked by default and should be populated by the
    Environment variables of your CI server`
  );

  if(fs.existsSync(PATH_SECRETS)) {
    secrets = require(PATH_SECRETS);
    logger.info(`Configuration found in ${PATH_SECRETS}`);
    const overwrite = await logger.confirm('Do you want to overwrite it?', true);

    if(!overwrite) {
      return;
    }
  }

  let certificatePath;
  if(!secrets.SSH_PRIVATE_KEY || !secrets.SSH_PUBLIC_KEY) {
    if(fs.existsSync(PATH_SSH)) {
      const certificates = fs.readdirSync(PATH_SSH)
        .filter(str => pubCertRegex.test(str))
        .map(str => str.replace(pubCertRegex, ''));

      if(certificates.length) {
        logger.info(`These keys were found in ${PATH_SSH}, select one:`);

        certificates.push('Skip selection...');

        const { selectedIndex, selectedText } = await terminal.select(certificates);

        if(selectedIndex !== certificates.length - 1) {
          certificatePath = path.resolve(PATH_SSH, selectedText);
        }
      }
    }

    if(!certificatePath) {
      logger.warning('No private/public key pair found!')
      const generateCertificate = await logger.confirm('Do you want to generate a new one?', true);

      if(generateCertificate) {
        if(!shell.which('ssh-keygen')) {
          logger.warning('ssh-keygen not found.');
        } else {
          let overwriteKey = false;
          certificatePath = await askCertificateSaveLocation();

          while(shell.test('-f', certificatePath) && !overwriteKey) {
            logger.warning(`Key ${certificatePath} already exists.`);

            overwriteKey = await logger.confirm('Do you want to overwrite it?');
            if(!overwriteKey) {
              certificatePath = await askCertificateSaveLocation();
            }
          }
          
          const passphrase = await logger.passwordInput('Enter passphrase (Optional):');

          shell.rm([certificatePath, `${certificatePath}.pub`]);
          shell.exec(`ssh-keygen -b 2048 -t rsa -N "${passphrase}" -m PEM -f ${certificatePath}`);
        }
      }
    }

    if(!certificatePath) {
      logger.warning('Cannot find a valid certificate');
    } else {
      secrets.SSH_PUBLIC_KEY = fs.readFileSync(`${certificatePath}.pub`, 'utf8').trim();
      secrets.SSH_PRIVATE_KEY = fs.readFileSync(certificatePath, 'utf8').trim();
      secrets.SSH_KEY_NAME = secrets.SSH_PUBLIC_KEY.split(' ')[2];
    }
  }

  for(let key in secretsMap) {
    secrets[key] = await logger.textInput(`${secretsMap[key]}: `, secrets[key]);
  }

  logger.info('The following configuration will be saved:\n');
  
  Object.keys(secrets).forEach(key =>
    logger.dataRow(key, secrets[key])
  );
  
  const confirm = logger.confirm('Does this look OK?', true);
  if(confirm) {
    fs.writeFileSync(PATH_SECRETS, JSON.stringify(secrets));
  }
}

module.exports = {
  run: initSecrets,
  help: 'Configures secrets.json (required for DevOps scripts)',
};
