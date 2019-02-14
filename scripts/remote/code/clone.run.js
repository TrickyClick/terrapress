

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');
const {
  app: {
    domain,
    repositoryUrl,
    SERVER_PATH_CODEBASE,
  },
} = require('../../config');

const codeClone = async () => {
  const ssh = await getConnection();

  if (!await ssh.directoryExists(SERVER_PATH_CODEBASE)) {
    logger.begin(`Clonning ${repositoryUrl} into ${SERVER_PATH_CODEBASE}`);

    try {
      const env = 'GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no"';
      await ssh.exec(`${env} git clone -q ${repositoryUrl} ${SERVER_PATH_CODEBASE}`);
    } catch (e) { }

    await ssh.exec(`chown -R www-data:www-data ${SERVER_PATH_CODEBASE}`);
    await ssh.exec(`ln -s ${SERVER_PATH_CODEBASE} /root/${domain}`);

    logger.success('Repository successfully cloned on the server.');
  } else {
    logger.skipping(`Path ${SERVER_PATH_CODEBASE} already exists.`);
  }
};

module.exports = {
  run: codeClone,
  help: 'Clones this remote repository on the server',
};
