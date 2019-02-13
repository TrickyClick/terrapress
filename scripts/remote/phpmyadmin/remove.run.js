'use strict';

const logger = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const {
  app: {
    SERVER_PATH_WEBROOT,
  },
} = require('../../config');

const phpmyadminRemove = async() => {
  logger.begin('Removing phpMyAdmin...');
  const ssh = await getConnection();

  await ssh.exec(`rm -rf ${SERVER_PATH_WEBROOT}/phpmyadmin`);

  logger.success(`phpMyAdmin is uninstalled!`);
};

module.exports = {
  run: phpmyadminRemove,
  help: 'Uninstalls phpMyAdmin from the server',
};