const path = require('path');

const apacheRestart = require('./restart.run');
const logger = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const { renderTemplate } = require('../../helpers/strings');
const {
  app: {
    domain,
    supportEmail,
    SERVER_PATH_WEBROOT,
    SSL_PRIVATE_KEY,
    SSL_CERTIFICATE,
    SSL_CHAIN_FILE,
  },
} = require('../../config');

const sitesEnabled = '/etc/apache2/sites-enabled';
const apacheConfigPath = `/etc/apache2/sites-available/${domain}.conf`;
const apacheTemplate = path.resolve(__dirname, 'assets', 'site.tpl.conf');
const activeModules = [
  'php7.0',
  'rewrite',
  'ssl',
  'http2',
];

const apacheSetup = async () => {
  logger.begin('Setting up Apache...');
  const ssh = await getConnection();

  for (const module of activeModules) {
    logger.info(`Enabling Apache mod-${module}`);
    await ssh.exec(`a2enmod ${module}`);
  }

  logger.info('Saving Apache settings');
  const apacheConfig = renderTemplate(apacheTemplate, {
    domain,
    supportEmail,
    SERVER_PATH_WEBROOT,
    SSL_PRIVATE_KEY,
    SSL_CERTIFICATE,
    SSL_CHAIN_FILE,
  });

  await ssh.pushToFile(apacheConfig, apacheConfigPath);
  await ssh.exec('rm *', [], { cwd: sitesEnabled });
  await ssh.exec(`a2ensite ${domain}`);

  logger.success('Apache is ready to go!');
  await apacheRestart.run();
};

module.exports = {
  run: apacheSetup,
  help: 'Configures Apache - domain, SSL, etc.',
};
