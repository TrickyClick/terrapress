'use strict';

const fs = require('fs');

const logger = require('../helpers/logger');
const secretsMap = require('../config/secretsMap');

let secrets;

const getSecretsConfig = pathSecrets => {
  if(!secrets) {
    secrets = fs.existsSync(pathSecrets) ? require(pathSecrets) : {};

    for(let key in secretsMap) {
      if(process.env.hasOwnProperty(key)) {
        secrets[key] = process.env[key];
      }

      if(!secrets[key]) {
        logger.fatal(`required secret ${key} was not found.`);
        logger.info(
          `Run "npm run init" to set up your secrets.json
          or add ${key} to your CI environment variables`);
        process.exit();
      }
    }
  }

  return secrets;
}

module.exports = getSecretsConfig;