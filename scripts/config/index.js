const path = require('path');
const os = require('os');

const getAppConfig = require('../config/app');
const getSecretsConfig = require('../config/secrets');

const PATH_ROOT = path.resolve(__dirname, '..', '..');
const SERVER_PORT = 8080;
const SERVER_HOST = '0.0.0.0';
const PHP_VERSION_MIN = 5.4;
const USER_HOME = os.userInfo().homedir;
const PATH_APP_CONFIG = path.resolve(PATH_ROOT, 'app.json');
const PATH_SECRETS = path.resolve(PATH_ROOT, 'secrets.json');

module.exports = {
  get app() {
    return getAppConfig(PATH_APP_CONFIG);
  },
  get secrets() {
    return getSecretsConfig(PATH_SECRETS);
  },
  SERVER_UPLOAD_LIMIT_MB: 25,
  PATH_ROOT,
  SERVER_PORT,
  SERVER_HOST,
  USER_HOME,
  PATH_APP_CONFIG,
  PATH_SECRETS,
  PHP_VERSION_MIN,
  PATH_SSH: path.resolve(USER_HOME, '.ssh'),
  PATH_SCRIPTS: path.resolve(PATH_ROOT, 'scripts'),
  PATH_WORDPRESS: path.resolve(PATH_ROOT, 'wordpress'),
  PATH_BACKUP: path.resolve(PATH_ROOT, 'backup'),
  PATH_SRC: path.resolve(PATH_ROOT, 'src'),
  PATH_TEMP: path.resolve(PATH_ROOT, '.tmp'),
  PATH_TERRAFORM: path.resolve(PATH_ROOT, 'terraform'),
  LOCAL_URL: `http://${SERVER_HOST}:${SERVER_PORT}`,
  DB_USER: 'wordpress',
  DB_NAME: 'wordpress',
  WORDPRESS_SOURCE_URL: 'https://wordpress.org/latest.zip',
  WEB_USER_NAME: 'www-data',
  WEB_USER_GROUP: 'www-data',
};
