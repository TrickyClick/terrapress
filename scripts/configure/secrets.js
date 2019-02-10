'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const { PATH_SECRETS, PATH_SSH } = require('../config');
const secretsMap = require('../config/secretsMap');
const terminal = require('../helpers/terminal');

const pubCertRegex = /\.pub$/;

const input = async (message, defaultValue, echoChar = false) => {
  terminal.yellow(message);
  const value = await terminal.inputField({
    echoChar,
    cancelable: true,
    default: defaultValue || '',
  }).promise;

  terminal('\n');
  return value;
}

const configureSecrets = async () => {
  let secrets = {};

  terminal.brightRed('\nSecrets configuration.\n\n');
  terminal.cyan(`These values will be saved as\n\n  `)
  terminal.bold(PATH_SECRETS);
  terminal.cyan(
    '\n\nwhich is not tracked. The correct order to configure\n' +
    'these variables would be to export them as environment\n' +
    'variables with the same names on your CI server.\n\n'
  );

  if(fs.existsSync(PATH_SECRETS)) {
    secrets = require(PATH_SECRETS);
    terminal.yellow(`Configuration found in ${PATH_SECRETS}\n`);
    terminal.bold('Do you want to overwrite it?');
    const overwrite = await terminal.confirm(true);

    if(!overwrite) {
      return;
    }
  }

  let certificatePath;
  if(!secrets.SSH_PRIVATE_KEY || !secrets.SSH_PUBLIC_KEY) {
    if(fs.existsSync(PATH_SSH)) {
      const certificates = fs.readdirSync(PATH_SSH)
        .filter(str => pubCertRegex.test(str))
        .map(str => `* ${path.resolve(PATH_SSH, str.replace(pubCertRegex, ''))}`);

      if(certificates.length) {
        terminal.blue(`These keys were found in ${PATH_SSH}, select one:\n`)
        certificates.push('* Skip selection...');
        const { selectedIndex, selectedText } = await terminal.singleColumnMenu(certificates).promise;

        if(selectedIndex !== certificates.length - 1) {
          certificatePath = path.resolve(PATH_SSH, selectedText.substr(2));
        }
      }
    }

    if(!certificatePath) {
      terminal.yellow('No private/public key pair registered, do you want\n')
      terminal.bold('to use an existing one?');

      const generateCertificate = await terminal.confirm(true);
      if(generateCertificate) {
        if(!shell.which('ssh-keygen')) {
          terminal.bgBrightRed('WARNING:');
          terminal.bold('ssh-keygen not found.\n');
        } else {
          const filename = await input('Enter filename: ', path.resolve(PATH_SSH, 'id_rsa'));
          const passphrase = await input('Enter passphrase (Optional): ', '', '');

          await shell.exec(`ssh-keygen -t rsa -p "${passphrase}" -f ${filename}`);
          certificatePath = filename;
        }
      }
    }

    if(!certificatePath) {
      terminal.bgBrightRed('WARNING:');
      terminal.bold('Cannot find a valid certificate\n');
    } else {
      secrets.SSH_PUBLIC_KEY = fs.readFileSync(`${certificatePath}.pub`, 'utf8').trim();
      secrets.SSH_PRIVATE_KEY = fs.readFileSync(certificatePath, 'utf8').trim();
      secrets.SSH_KEY_NAME = secrets.SSH_PUBLIC_KEY.split(' ')[2];
    }
  }

  for(let key in secretsMap) {
    secrets[key] = await input(`${secretsMap[key]}: `, secrets[key]);
  }

  terminal.green('\nThe following configuration will be saved:\n\n')
  
  Object.keys(secrets).forEach(key =>
    terminal.white(`\t${key}: `) &&
    terminal.gray(`${secrets[key]}\n`)
  );
  
  terminal.brightRed('\nDoes this look OK?');
  const confirm = await terminal.confirm(true);
  
  if(confirm) {
    fs.writeFileSync(PATH_SECRETS, JSON.stringify(secrets));
  }
}

module.exports = configureSecrets;