'use strict';

const path = require('path');

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

const certificateRefresh = async() => {
  logger.info(`Refreshing ${domain} certificate`);
  
  const certificatePlan = terraform.getCertificatePlan();
  await certificatePlan.apply();
  
  logger.info('Saving SSL certificates');

  const ssh = await getConnection();
  ssh.exec(`mkdir -p ${path.dirname(SSL_PRIVATE_KEY)}`);

  const { output } = certificatePlan;
  return await Promise.all([
    ssh.pushToFile(output.PRIVATE_KEY_PEM, SSL_PRIVATE_KEY),
    ssh.pushToFile(output.CERTIFICATE_PEM, SSL_CERTIFICATE),
    ssh.pushToFile(output.ISSUER_PEM, SSL_CHAIN_FILE),
  ]);
}

module.exports = certificateRefresh;
