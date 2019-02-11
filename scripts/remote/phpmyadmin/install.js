'use strict';

const logger = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');
const {
  app: {
    SERVER_PATH_CODEBASE,
    SERVER_PATH_WEBROOT,
  },
  WEB_USER_NAME,
  WEB_USER_GROUP,
} = require('../../config');

const dist = '4.8.4-english';
const sourceUrl = `https://files.phpmyadmin.net/phpMyAdmin/4.8.4/phpMyAdmin-${dist}.tar.gz`;

const phpmyadminInstall = async() => {
  logger.info('Installing phpMyAdmin...');
  const ssh = await getConnection();

  const tmp = `${SERVER_PATH_CODEBASE}/.tmp/phpmyadmin`;
  const dest = `${SERVER_PATH_WEBROOT}/phpmyadmin`;

  await ssh.exec(`mkdir -p ${tmp}`);
  await ssh.exec(`curl -s -L ${sourceUrl} --output ${tmp}/phpmyadmin.tar.gz`);
  await ssh.exec(`tar -zxf ${tmp}/phpmyadmin.tar.gz --directory ${tmp}`);
  await ssh.exec(`mv -f ${tmp}/${dist} ${dest}`);
  await ssh.exec(`chown -R ${WEB_USER_NAME}:${WEB_USER_GROUP} ${dest}`);
  await ssh.exec(`rm -rf ${tmp}`);

  logger.info(`phpMyAdmin ${dist} is installed!`);
};

module.exports = phpmyadminInstall;
