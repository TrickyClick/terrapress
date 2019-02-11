'use strict';

const path = require('path');

const {
  DB_NAME,
  DB_USER,
  app: {
    SERVER_PATH_WP_DB_CONFIG
  },
} = require('../../config');
const logger = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const { randomString, renderTemplate } = require('../../helpers/strings');

const createUserTemplate = path.resolve(__dirname, 'assets', 'create-user.tpl.sql');
const wpDbConfigTemplate = path.resolve(__dirname, 'assets', 'wp-db-config.tpl.php');

const dbSetup = async () => {
  logger.info('Setting up MariaDb...');

  const ssh = await getConnection();
  const DB_PASSWORD = randomString(32);

  const wpDbConfig = renderTemplate(wpDbConfigTemplate, { DB_PASSWORD });
  const createUserSql = renderTemplate(createUserTemplate, {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
  });

  logger.info('Updating MariaDb credentials');
  await ssh.exec(`mysql -uroot -e "${createUserSql}"`);
  
  logger.info('Updating WordPress db settings');
  await ssh.pushToFile(wpDbConfig, SERVER_PATH_WP_DB_CONFIG);

  logger.success('MariaDb configured successfully')
};

module.exports = dbSetup;