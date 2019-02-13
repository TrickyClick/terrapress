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

    try {
      const env = 'GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no"';
      await ssh.exec(`${env} git clone -q ${repositoryUrl} ${SERVER_PATH_CODEBASE}`);
    } catch(e) { }

    await ssh.exec(`chown -R www-data:www-data ${SERVER_PATH_CODEBASE}`);
    await ssh.exec(`ln -s ${SERVER_PATH_CODEBASE} /root/${domain}`);
  }
}

module.exports = codeClone;
