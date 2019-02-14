

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');

const apacheRestart = async () => {
  logger.begin('Restarting Apache...');

  const ssh = await getConnection();
  await ssh.exec('service apache2 restart');

  logger.success('Apache has been restarted!');
};

module.exports = {
  run: apacheRestart,
  help: 'Restarts Apache on the remote server',
};
