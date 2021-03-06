const path = require('path');
const shell = require('shelljs');

const { download, unzip } = require('../../helpers/file');
const { logger } = require('../../helpers/logger');
const {
  PATH_BACKUP,
  PATH_SRC,
  PATH_WORDPRESS,
  PATH_TEMP,
  WORDPRESS_SOURCE_URL,
} = require('../../config');

const checkFiles = [
  'wp-config.php',
  'wp-db-config.php',
];

const setupWordpress = async () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const dest = path.resolve(PATH_TEMP, `wordpress-${timestamp}`);
  const zip = await download(WORDPRESS_SOURCE_URL, `${dest}.zip`);
  const unzippedContent = path.resolve(dest, 'wordpress', '*');
  const wpContent = path.resolve(PATH_WORDPRESS, 'wp-content');

  logger.begin('Installing Wordpress');

  if (shell.test('-d', PATH_WORDPRESS)) {
    logger.info(`Backing up old WordPress files in ${PATH_WORDPRESS}`);

    const backup = path.resolve(PATH_BACKUP, `wordpress-${timestamp}`);

    shell.mkdir('-p', PATH_BACKUP);
    shell.mv(PATH_WORDPRESS, backup);
    logger.info(`Backed up WordPress files into ${backup}`);

    shell.mkdir('-p', PATH_WORDPRESS);
    checkFiles.forEach((filePath) => {
      const backupFile = path.resolve(backup, filePath);

      if (shell.test('-f', backupFile)) {
        logger.info(`Importing ${filePath} from backup`);

        const backupDest = path.resolve(PATH_WORDPRESS, filePath);
        shell.cp(backupFile, backupDest);
      }
    });
  }

  logger.info(`Unzipping ${zip}...`);
  await unzip(zip, dest);

  logger.info('Updating content');
  shell.mkdir('-p', PATH_WORDPRESS);
  shell.mv('-f', unzippedContent, PATH_WORDPRESS);
  shell.ln('-s', PATH_SRC, wpContent);

  logger.info('Deleting temp files');
  shell.rm('-rf', [dest, zip, wpContent]);

  logger.success('WordPress installation complete');
};

module.exports = {
  run: setupWordpress,
  help: 'Install WordPress (preserves previous install and config)',
};
