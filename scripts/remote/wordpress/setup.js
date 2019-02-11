'use strict';

const fs = require('fs');
const path = require('path');

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');
const { randomString } = require('../../helpers/strings');
const {
  app: {
    domain,
    SERVER_PATH_CODEBASE,
    SERVER_PATH_WEBROOT,
    SERVER_PATH_WP_CONFIG,
  },
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  WORDPRESS_SOURCE_URL,
} = require('../../config');

const templatePath = path.resolve(__dirname, 'assets', 'wp-config.tpl.php');
const wpConfigTemplate = fs.readFileSync(templatePath, 'utf8');

const wordpressSetup = async () => {
  logger.info('Configuring WordPress on the remote host');
  const ssh = await getConnection();
  const targzSource = WORDPRESS_SOURCE_URL.replace(/\.zip$/, '.tar.gz');

  if(!await ssh.directoryExists(SERVER_PATH_WEBROOT)) {
    const temp = `${SERVER_PATH_CODEBASE}/.tmp/wordpress-dump-${Date.now()}`;
    const tempFile = `${temp}/latest.tar.gz`;

    logger.info('Downloading latest WordPress');
    await ssh.exec(`mkdir -p ${temp}`);
    await ssh.exec(`curl -s -L ${targzSource} --output ${tempFile}`);

    logger.info('Extracting archive');
    await ssh.exec('tar -zxf latest.tar.gz', [], { cwd: temp });

    logger.info('Linking content');
    await ssh.exec('rm -rf wordpress/wp-content wordpress/wp-config-sample.php', [], { cwd: temp });
    await ssh.exec(`mkdir -p ${SERVER_PATH_WEBROOT}`);
    await ssh.exec(`mv wordpress/* ${SERVER_PATH_WEBROOT}/`, [], { cwd: temp });
    await ssh.exec(`ln -s ${SERVER_PATH_CODEBASE}/src ${SERVER_PATH_WEBROOT}/wp-content`)

    logger.info('Removing temp...');
    await ssh.exec(`rm -rf ${temp}`);

    logger.success('WordPress installed on the server!');
  }

  logger.info('Updating WordPress config');
  const wpConfig = wpConfigTemplate
    .replace(/%domain%/gi, domain)
    .replace(/%secret%/gi, () => randomString(40))
    .replace(/%MYSQL_USERNAME%/gi, MYSQL_USERNAME)
    .replace(/%MYSQL_DATABASE%/gi, MYSQL_DATABASE)

  await ssh.pushToFile(wpConfig, SERVER_PATH_WP_CONFIG);
  await ssh.exec(`chown -R www-data:www-data .`, [], { cwd: SERVER_PATH_WEBROOT });

  logger.success('WordPress config updated!');
}

module.exports = wordpressSetup;
