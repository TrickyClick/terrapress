'use trict';

const { app } = require('./config');
const logger = require('./helpers/logger');
const getConnection = require('./helpers/ssh');

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
  logger.info('Updating aptitude');
  await ssh.exec('apt-get -qq update');

  for(let dependency of dependencies) {
    logger.info(`Installing ${dependency}`);
    await ssh.exec(`DEBIAN_FRONTEND=noninteractive apt-get -qq install ${dependency}`);
  }

  const remoteCertPath = '$HOME/.ssh/id_rsa';

  if(!await ssh.fileExists(remoteCertPath)) {
    logger.info(`Generating server SSH key`);
    const cmd = `yes y | ssh-keygen -b 2048 -N "" -m PEM -t rsa -C "${app.domain}" -f "${remoteCertPath}"`;
    await ssh.exec(cmd);
  }

  await ssh.exec(`git config --global core.editor "vim"`);
  logger.success('Installation complete');
};

module.exports = installDependencies;
