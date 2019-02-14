'use trict';

const { app } = require('../config');
const logger = require('../helpers/logger');
const getConnection = require('../helpers/ssh');

const dependencies = [
  'mariadb-client',
  'mariadb-server',
  'php7.0',
  'php7.0-mysql',
  'php7.0-gd',
  'php7.0-curl',
  'apache2',
  'libapache2-mod-php7.0',
  'git',
  'curl',
];

const certificatesPath = '$HOME/.ssh/id_rsa';
const wpCliPath = '/usr/local/bin/wp';
const wpCliUrl = 'https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar';

const installDependencies = async () => {
  const ssh = await getConnection();

  logger.begin('Installing server dependencies');
  logger.info('Updating aptitude');
  await ssh.exec('apt-get -qq update');

  for (const dependency of dependencies) {
    logger.info(`Installing ${dependency}`);
    await ssh.exec(`DEBIAN_FRONTEND=noninteractive apt-get -qq install ${dependency}`);
  }

  if (!await ssh.fileExists(certificatesPath)) {
    logger.info('Generating server SSH key');
    const cmd = `yes y | ssh-keygen -b 2048 -N "" -m PEM -t rsa -C "${app.domain}" -f "${certificatesPath}"`;
    await ssh.exec(cmd);
  }

  logger.info('Installing WordPress CLI');
  if (!await ssh.fileExists(wpCliPath)) {
    await ssh.exec(`curl -s -o ${wpCliPath} ${wpCliUrl}`);
    await ssh.exec(`chmod +x ${wpCliPath}`);
  }

  await ssh.exec('git config --global core.editor "vim"');
  logger.success('Installation complete');
};

module.exports = {
  run: installDependencies,
  help: 'Installs all server dependencies, such as git, curl, Apache, MariaDb...',
};
