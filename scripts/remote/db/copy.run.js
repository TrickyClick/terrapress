const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const { app } = require('../../config');
const { replaceLinks } = require('../../helpers/strings');
const { logger } = require('../../helpers/logger');
const getConnection = require('../../helpers/ssh');

const {
  PATH_TEMP,
  PATH_WORDPRESS,
  LOCAL_URL,
} = require('../../config');

const dbCopy = async () => {
  const ssh = await getConnection();

  logger.begin('Downloading remote database...');
  const output = await ssh.exec('wp --allow-root --quiet db export /dev/stdout', [], {
    cwd: app.webRoot,
  });

  ssh.dispose();

  const formattedOutput = replaceLinks(output, app.domain, LOCAL_URL);
  const dbDump = path.resolve(PATH_TEMP, 'db-dump');
  shell.mkdir('-p', dbDump);

  const tempFileOriginal = path.resolve(dbDump, `${Date.now()}-original.sql`);
  const tempFile = path.resolve(dbDump, `${Date.now()}.sql`);

  fs.writeFileSync(tempFileOriginal, output);
  logger.info(`Saved original output to ${tempFileOriginal}`);

  fs.writeFileSync(tempFile, formattedOutput);
  logger.info(`Saved localised output to ${tempFile}`);

  shell.cd(PATH_WORDPRESS);
  shell.exec(`wp --quiet db import ${tempFile}`);

  logger.success(`Imported database from ${tempFile}`);
};

module.exports = {
  run: dbCopy,
  help: 'Overwrites local database with remote one',
};
