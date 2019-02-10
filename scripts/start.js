'use strict';

const shell = require('shelljs');

const terminal = require('./helpers/terminal');
const {
  PHP_VERSION_MIN,
  SERVER_PORT,
  SERVER_HOST,
  PATH_WORDPRESS,
} = require('./config');

const phpVersionRegex = /^php ([0-9]+\.[0-9]+)\./i;

if(!shell.test('-d', PATH_WORDPRESS)) {
  terminal.fatal('WordPress is not installed');
  terminal.info('Run "npm run local:setup" to prepare it');
  process.exit();
}

if(!shell.which('php')) {
  terminal.fatal('php binary cannot be found');
  process.exit();
}

const versionText = shell.exec('php -v');
const version = Number(phpVersionRegex.exec(versionText)[1]);

if(isNaN(version) || version < PHP_VERSION_MIN) {
  terminal.fatal(
    `php version "${version}" is invalid cannot be found
    The minimal version required is ${PHP_VERSION_MIN}`
  );
  process.exit();
}

terminal.info(`Serving WordPress from ${PATH_WORDPRESS}`);

shell.cd(PATH_WORDPRESS);
shell.exec(`php -S ${SERVER_HOST}:${SERVER_PORT}`);