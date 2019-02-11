'use strict';

const path = require('path');

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');
const terraform = require('../../helpers/terraform');
const {
  app: {
    domain,
    SERVER_PRIVATE_KEY_PEM,
    SERVER_CERTIFICATE_PEM,
    SERVER_ISSUER_PEM
  }
} = require('../../config');

const certificateRefresh = async() => {
  logger.info(`Refreshing ${domain} certificate`);
  
  const certificatePlan = terraform.getCertificatePlan();
  await certificatePlan.apply();
  
  logger.info('Saving SSL certificates');

  const ssh = await getConnection();
  ssh.exec(`mkdir -p ${path.dirname(SERVER_PRIVATE_KEY_PEM)}`);

  const { output } = certificatePlan;
  return await Promise.all([
    ssh.pushToFile(output.PRIVATE_KEY_PEM, SERVER_PRIVATE_KEY_PEM),
    ssh.pushToFile(output.CERTIFICATE_PEM, SERVER_CERTIFICATE_PEM),
    ssh.pushToFile(output.ISSUER_PEM, SERVER_ISSUER_PEM),
  ]);
}

module.exports = certificateRefresh;
