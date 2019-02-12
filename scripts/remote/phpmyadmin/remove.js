'use strict';

const logger = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const {
  app: {
    SERVER_PATH_WEBROOT,
  },
} = require('../../config');

const phpmyadminRemove = async() => {
  logger.info('Removing phpMyAdmin...');
  const ssh = await getConnection();

  await ssh.exec(`rm -rf ${SERVER_PATH_WEBROOT}/phpmyadmin`);

  logger.info(`phpMyAdmin is uninstalled!`);
};

phpmyadminRemove()
  .then(process.exit)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
