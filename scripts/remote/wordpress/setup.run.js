const path = require('path');

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');
const { randomString, renderTemplate } = require('../../helpers/strings');
const {
  app: {
    domain,
    SERVER_PATH_CODEBASE,
    SERVER_PATH_WEBROOT,
    SERVER_PATH_WP_CONFIG,
  },
  DB_NAME,
  DB_USER,
  WORDPRESS_SOURCE_URL,
  WEB_USER_NAME,
  WEB_USER_GROUP,
} = require('../../config');

const templatePath = path.resolve(__dirname, 'assets', 'wp-config.tpl.php');

const wordpressSetup = async () => {
  logger.begin('Setting up WordPress...');
  const ssh = await getConnection();
  const targzSource = WORDPRESS_SOURCE_URL.replace(/\.zip$/, '.tar.gz');

  if (!await ssh.directoryExists(SERVER_PATH_WEBROOT)) {
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
    await ssh.exec(`ln -s ${SERVER_PATH_CODEBASE}/src ${SERVER_PATH_WEBROOT}/wp-content`);

    logger.info('Removing temp');
    await ssh.exec(`rm -rf ${temp}`);

    logger.success('WordPress installed correctly!');
  }

  logger.info('Updating WordPress config');
  const wpConfig = renderTemplate(templatePath, {
    DB_USER,
    DB_NAME,
    domain,
    secret: () => randomString(40),
  });

  await ssh.pushToFile(wpConfig, SERVER_PATH_WP_CONFIG);

  logger.info(`Changing Web Root ownership to ${WEB_USER_NAME}`);
  await ssh.exec(`chown -R ${WEB_USER_NAME}:${WEB_USER_GROUP} .`, [], { cwd: SERVER_PATH_WEBROOT });

  logger.success('WordPress is ready to go!');
};

module.exports = {
  run: wordpressSetup,
  help: 'Installs WordPress and creates wp-config.php',
};
