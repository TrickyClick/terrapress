

const fs = require('fs');

const logger = require('../helpers/logger');

let app;

const getAppConfig = (configPath) => {
  if (!app) {
    if (!fs.existsSync(configPath)) {
      logger.fatal(`${configPath} was not found.`);
      logger.info('Run "npm run init" to set it up');
      process.exit();
    }

    app = require(configPath);

    app.SERVER_PATH_CODEBASE = `/var/www/${app.domain}`;
    app.SERVER_PATH_WEBROOT = `${app.SERVER_PATH_CODEBASE}/wordpress`;
    app.SERVER_PATH_WP_CONFIG = `${app.SERVER_PATH_WEBROOT}/wp-config.php`;
    app.SERVER_PATH_WP_DB_CONFIG = `${app.SERVER_PATH_WEBROOT}/wp-db-config.php`;

    app.SERVER_PATH_CERTIFICATES = `/etc/ssl/${app.domain}`;
    app.SSL_PRIVATE_KEY = `${app.SERVER_PATH_CERTIFICATES}/${app.domain}.pem`;
    app.SSL_CERTIFICATE = `${app.SERVER_PATH_CERTIFICATES}/${app.domain}.crt`;
    app.SSL_CHAIN_FILE = `${app.SERVER_PATH_CERTIFICATES}/DigiCertCA.crt`;
  }

  return app;
};

module.exports = getAppConfig;
