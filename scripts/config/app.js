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
  }

  return app;
};

module.exports = getAppConfig;
  