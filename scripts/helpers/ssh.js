'use strict';

const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const node_ssh = require('node-ssh');

const { secrets, PATH_TEMP } = require('../config');
const logger = require('./logger');
const terraform = require('./terraform');
const { randomString } = require('./strings');

const ssh = new node_ssh();
const retry = 5;
const timeout = 5;

const exists = async (path, isDirectory = false) => {
  const type = isDirectory ? 'd' : 'f';
  const cmd = `if [ -${type} ${path} ]; then echo 1; else echo 0; fi`;

  return await ssh.exec(cmd) == 1;
}

ssh.fileExists = file => exists(file, false);
ssh.directoryExists = dir => exists(dir, true);

ssh.pushToFile = async (data, dest) => {
  logger.info(`Pushing to file: ${dest}`);
  const random = randomString(10);
  const localTemp = path.resolve(PATH_TEMP, 'ssh', `${Date.now()}-${random}.temp`);

  shell.mkdir('-p', path.dirname(localTemp));
  fs.writeFileSync(localTemp, data);

  await ssh.putFile(localTemp, dest);
  return fs.unlinkSync(localTemp);
}

let connection;

const tryConnect = async (attempts, options) => {
  try {
    await ssh.connect(options);
  } catch(e) {
    if(!--attempts) {
      logger.fatal('SSH failed to connect');
      return false;
    }

    logger.warning(`SSH didn't connect. ${attempts} attempts left, retrying in ${timeout} seconds...`);
    await new Promise(r => setTimeout(r, timeout*1000));
    return tryConnect(attempts, options);
  }
}

const getConnection = () => {
  if(!connection) {
    const servicePlan = terraform.getServicePlan();
    const { IP } = servicePlan.output;

    if(!IP) {
      throw new Error(`Remote host IP is not defined`);
    }

    logger.info(`Connecting to host: ${IP}`);

    const options = {
      host: IP,
      username: 'root',
      privateKey: secrets.SSH_PRIVATE_KEY,
    };

    connection = tryConnect(retry, options)
      .then(() => ssh);
  }

  return connection;
}

module.exports = getConnection;