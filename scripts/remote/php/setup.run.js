

const apacheRestart = require('../apache/restart.run');
const { logger } = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const { SERVER_UPLOAD_LIMIT_MB } = require('../../config');

const phpSetup = async () => {
  logger.begin('Setting up PHP...');
  const ssh = await getConnection();

  logger.info(`Setting up upload max filesize to: ${SERVER_UPLOAD_LIMIT_MB}MB`);
  await ssh.exec(
    `sed -ri 's/^(upload_max_filesize = )[0-9]+(M.*)$/\\1'${SERVER_UPLOAD_LIMIT_MB}'\\2/' /etc/php/7.0/apache2/php.ini`,
  );

  logger.info(`Setting up POST max size to: ${SERVER_UPLOAD_LIMIT_MB}MB`);
  await ssh.exec(
    `sed -ri 's/^(post_max_size = )[0-9]+(M.*)$/\\1'${SERVER_UPLOAD_LIMIT_MB}'\\2/' /etc/php/7.0/apache2/php.ini`,
  );

  logger.success('PHP is ready to go!');
  await apacheRestart.run();
};

module.exports = {
  run: phpSetup,
  help: 'Configures the server php.ini',
};
