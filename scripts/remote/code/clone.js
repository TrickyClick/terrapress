'use strict';

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');
const {
  app: {
    domain,
    repositoryUrl,
    SERVER_PATH_CODEBASE
  }
} = require('../../config');

const codeClone = async () => {
  const ssh = await getConnection();

  if(!await ssh.directoryExists(SERVER_PATH_CODEBASE)) {
    logger.info(`Clonning ${repositoryUrl} into ${SERVER_PATH_CODEBASE}`);
    await ssh.exec(`yes y | git clone --quiet ${repositoryUrl} ${SERVER_PATH_CODEBASE}`);
    await ssh.exec(`chown -R www-data:www-data ${SERVER_PATH_CODEBASE}`);
    await ssh.exec(`ln -s ${SERVER_PATH_CODEBASE} /root/${domain}`);
  }
}

module.exports = codeClone;