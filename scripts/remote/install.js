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

const installDependencies = async() => {
  const ssh = await getConnection();

  logger.info('Installing server dependencies...');
  logger.info('Updating aptitude...');
  await ssh.exec('apt-get -qq update');

  for(let dep of dependencies) {
    logger.info(`Installing ${dep}`);
    await ssh.exec(`DEBIAN_FRONTEND=noninteractive apt-get -qq install ${dep}`);
  }

  const remoteCertPath = '$HOME/.ssh/id_rsa';

  if(!await ssh.fileExists(remoteCertPath)) {
    logger.info(`Generate server's SSH key`);
    const cmd = `yes y | ssh-keygen -b 2048 -N "" -m PEM -t rsa -C "${app.domain}" -f "${remoteCertPath}"`;
    await ssh.exec(cmd);
  }

  await ssh.exec(`git config --global core.editor "vim"`);
};

module.exports = installDependencies;
