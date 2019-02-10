'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const terminal = require('../helpers/terminal');
const secretsMap = require('../config/secretsMap');

const PATH_ROOT = path.resolve(__dirname, '..', '..');
const SERVER_PORT = 8080;
const SERVER_HOST = '0.0.0.0';
const PHP_VERSION_MIN = 5.4;
const USER_HOME = os.userInfo().homedir;
const PATH_APP_CONFIG = path.resolve(PATH_ROOT, 'app.json');
const PATH_SECRETS = path.resolve(PATH_ROOT, 'secrets.json');

let app, secrets;

module.exports = {
  get app() {
    if(!app) {
      if(!fs.existsSync(PATH_APP_CONFIG)) {
        terminal.fatal(`${PATH_APP_CONFIG} was not found.`);
        terminal.info('Run "npm run init" to set it up');
        process.exit();
      }
      
      app = require(PATH_APP_CONFIG);
    }

    return app;
  },
  get secrets() {
    if(!secrets) {
      secrets = fs.existsSync(PATH_SECRETS) ? require(PATH_SECRETS) : {};

      for(let key in secretsMap) {
        if(process.env.hasOwnProperty(key)) {
          secrets[key] = process.env[key];
        }
  
        if(!secrets[key]) {
          terminal.fatal(`required secret ${key} was not found.`);
          terminal.info(
            `Run "npm run init" to set up your secrets.json
            or add ${key} to your CI environment variables`);
          process.exit();
        }
      }
    }

    return secrets;
  },
  PATH_ROOT,
  SERVER_PORT,
  SERVER_HOST,
  USER_HOME,
  PATH_APP_CONFIG,
  PATH_SECRETS,
  PHP_VERSION_MIN,
  PATH_SSH: path.resolve(USER_HOME, '.ssh'),
  PATH_WORDPRESS: path.resolve(PATH_ROOT, 'wordpress'),
  PATH_BACKUP: path.resolve(PATH_ROOT, 'backup'),
  PATH_SRC: path.resolve(PATH_ROOT, 'src'),
  PATH_TEMP: path.resolve(PATH_ROOT, '.tmp'),
  PATH_TERRAFORM: path.resolve(PATH_ROOT, 'terraform'),
  LOCAL_URL: `http://${SERVER_HOST}:${SERVER_PORT}`,
  WORDPRESS_SOURCE_URL: 'https://wordpress.org/latest.zip',
};
