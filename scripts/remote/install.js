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
  const exists = await ssh.exec(`if [ -f "${remoteCertPath}" ]; then echo "1"; else echo "0"; fi`);

  if(exists == 0) {
    logger.info(`Generate server's SSH key`);
    const password = await ssh.exec('echo -n $(date) | sha512sum');
    const cmd = `yes y | ssh-keygen -b 2048 -N "${password}" -m PEM -t rsa -C "${app.domain}" -f "${remoteCertPath}"`;
    await ssh.exec(cmd);
  }

  await ssh.exec(`git config --global core.editor "vim"`);
};

module.exports = installDependencies;
