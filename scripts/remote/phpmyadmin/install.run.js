const logger = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const {
  app: {
    domain,
    SERVER_PATH_CODEBASE,
    SERVER_PATH_WEBROOT,
  },
  WEB_USER_NAME,
  WEB_USER_GROUP,
} = require('../../config');

const dist = '4.8.4-english';
const sourceUrl = `https://files.phpmyadmin.net/phpMyAdmin/4.8.4/phpMyAdmin-${dist}.tar.gz`;

const phpmyadminInstall = async () => {
  logger.begin('Installing phpMyAdmin...');
  const ssh = await getConnection();

  const dirname = 'phpmyadmin';
  const tmp = `${SERVER_PATH_CODEBASE}/.tmp/${dirname}`;
  const dest = `${SERVER_PATH_WEBROOT}/${dirname}`;

  if (await ssh.directoryExists(dest)) {
    logger.warning(`Path ${dest} already exists.`);
    logger.warning('Aborting.');
    return;
  }

  await ssh.exec(`mkdir -p ${tmp}`);
  await ssh.exec(`curl -s -L ${sourceUrl} --output ${tmp}/phpmyadmin.tar.gz`);
  await ssh.exec(`tar -zxf ${tmp}/phpmyadmin.tar.gz --directory ${tmp}`);
  await ssh.exec(`mv -f ${tmp}/phpMyAdmin-${dist} ${dest}`);
  await ssh.exec(`chown -R ${WEB_USER_NAME}:${WEB_USER_GROUP} ${dest}`);
  await ssh.exec(`rm -rf ${tmp}`);

  logger.success(`Installed at https://${domain}/${dirname}!`);
};

module.exports = {
  run: phpmyadminInstall,
  help: 'Installs phpMyAdmin on the server',
};
