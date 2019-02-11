'use strict';

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');

const apacheRestart = async () => {
  logger.info('Restarting Apache...');

  const ssh = await getConnection();
  await ssh.exec('service apache2 restart');

  logger.success('Done!');
}

module.exports = apacheRestart;
