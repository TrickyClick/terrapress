'use strict';

const fs = require('fs');

const logger = require('../helpers/logger');
let app;

const getAppConfig = configPath => {
  if(!app) {
    if(!fs.existsSync(configPath)) {
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
    app.SERVER_PRIVATE_KEY_PEM = `${app.SERVER_PATH_CERTIFICATES}/${app.domain}.pem`;
    app.SERVER_CERTIFICATE_PEM  = `${app.SERVER_PATH_CERTIFICATES}/${app.domain}.crt`;
    app.SERVER_ISSUER_PEM = `${app.SERVER_PATH_CERTIFICATES}/DigiCertCA.crt`;
  }

  return app;
};

module.exports = getAppConfig;
  