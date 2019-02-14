

const shell = require('shelljs');

const logger = require('../helpers/logger');
const {
  PHP_VERSION_MIN,
  SERVER_PORT,
  SERVER_HOST,
  PATH_WORDPRESS,
} = require('../config');

const phpVersionRegex = /^php ([0-9]+\.[0-9]+)\./i;

const start = async () => {
  const host = `${SERVER_HOST}:${SERVER_PORT}`;

  if (!shell.test('-d', PATH_WORDPRESS)) {
    logger.fatal('WordPress is not installed');
    logger.run('npm run exec local:wordpress:setup', 'to set it up');
    process.exit();
  }

  if (!shell.which('php')) {
    logger.fatal('php binary cannot be found');
    process.exit();
  }

  const versionText = shell.exec('php -v');
  const version = Number(phpVersionRegex.exec(versionText)[1]);

  if (Number.isNaN(version) || version < PHP_VERSION_MIN) {
    logger.fatal(
      `php version "${version}" is invalid cannot be found
      The minimal version required is ${PHP_VERSION_MIN}`,
    );
    process.exit();
  }

  logger.info(`Serving WordPress from ${PATH_WORDPRESS}`);
  logger.info(`Open http://${host}`);

  shell.exec(`php -S ${host}`, { cwd: PATH_WORDPRESS });
};

module.exports = {
  run: start,
  help: 'Starts local dev server (requires PHP and MySQL)',
};
