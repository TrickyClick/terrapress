'use strict';

const node_ssh = require('node-ssh');

const { secrets } = require('../config');
const logger = require('./logger');
const terraform = require('./terraform');

const ssh = new node_ssh();

let connection;
const getConnection = () => {
  if(!connection) {
    const servicePlan = terraform.getServicePlan();
    const { IP } = servicePlan.output;
    logger.info(`Connecting to host: ${IP}`);

    connection = ssh.connect({
      host: IP,
      username: 'root',
      privateKey: secrets.SSH_PRIVATE_KEY,
    })
    .then(() => ssh);
  }

  return connection;
}

module.exports = getConnection;