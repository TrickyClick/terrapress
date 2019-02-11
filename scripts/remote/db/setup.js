'use strict';

const fs = require('fs');
const path = require('path');

const {
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  app: {
    SERVER_PATH_WP_DB_CONFIG
  },
} = require('../../config');
const logger = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const { randomString } = require('../../helpers/strings');

const createUserTemplate = path.resolve(__dirname, 'assets', 'create-user.tpl.sql');
const wpDbConfigTemplate = path.resolve(__dirname, 'assets', 'wp-db-config.tpl.php');

const dbSetup = async () => {
  const ssh = await getConnection();
  const MYSQL_PASSWORD = randomString(32);
  const createUserSql = fs.readFileSync(createUserTemplate, 'utf8')
    .replace(/%MYSQL_DATABASE%/gi, MYSQL_DATABASE)
    .replace(/%MYSQL_USERNAME%/gi, MYSQL_USERNAME)
    .replace(/%MYSQL_PASSWORD%/gi, MYSQL_PASSWORD);

  const wpDbConfig = fs.readFileSync(wpDbConfigTemplate, 'utf8')
    .replace(/%MYSQL_PASSWORD%/gi, MYSQL_PASSWORD);
  
  logger.info('Updating credentials in MySQL');
  await ssh.exec(`mysql -uroot -e "${createUserSql}"`);
  
  logger.info('Saving new credentials to WordPress');
  await ssh.pushToFile(wpDbConfig, SERVER_PATH_WP_DB_CONFIG);
};

module.exports = dbSetup;