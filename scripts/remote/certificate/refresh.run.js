'use strict';

const path = require('path');

const apacheRestart = require('../apache/restart.run');
const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');
const terraform = require('../../helpers/terraform');
const {
  app: {
    domain,
    SSL_PRIVATE_KEY,
    SSL_CERTIFICATE,
    SSL_CHAIN_FILE
  }
} = require('../../config');

const certificateRefresh = async approve => {
  logger.info(`Refreshing ${domain} certificate`);
  
  const certificatePlan = terraform.getCertificatePlan();
  if(!await certificatePlan.apply(approve)) {
    return;
  }
  
  logger.info('Uploading new SSL certificates');
  const ssh = await getConnection();
  ssh.exec(`mkdir -p ${path.dirname(SSL_PRIVATE_KEY)}`);

  const { output } = certificatePlan;
  await Promise.all([
    ssh.pushToFile(output.PRIVATE_KEY_PEM, SSL_PRIVATE_KEY),
    ssh.pushToFile(output.CERTIFICATE_PEM, SSL_CERTIFICATE),
    ssh.pushToFile(output.ISSUER_PEM, SSL_CHAIN_FILE),
  ]);

  logger.success('SSL certificate is fresh & clean!');
  await apacheRestart.run();
}

module.exports = {
  run: certificateRefresh,
  help: 'Refreshes the domain SSL certificate (requires CloudFlare)',
};
