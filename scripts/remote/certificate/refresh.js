'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const getConnection = require('../../helpers/ssh');
const logger = require('../../helpers/logger');
const terraform = require('../../helpers/terraform');
const {
  app,
  PATH_TEMP,
  SERVER_PATH_CERTIFICATES,
} = require('../../config');

const putKey = async (ssh, data, dest) => {
  const localTemp = path.resolve(PATH_TEMP, 'certificates', dest);
  const remoteDest = path.resolve(SERVER_PATH_CERTIFICATES, dest);

  shell.mkdir('-p', path.dirname(localTemp));
  fs.writeFileSync(localTemp, data);

  await ssh.putFile(localTemp, remoteDest);
  return fs.unlinkSync(localTemp);
}

const certificateRefresh = async() => {
  logger.info(`Refreshing ${app.domain} certificate`);
  
  const certificatePlan = terraform.getCertificatePlan();
  await certificatePlan.apply();
  
  const {
    PRIVATE_KEY_PEM,
    CERTIFICATE_PEM,
    ISSUER_PEM
  } = certificatePlan.output;
  
  logger.info('Saving SSL certificates');

  const ssh = await getConnection();
  ssh.exec(`mkdir -p ${SERVER_PATH_CERTIFICATES}`);

  return await Promise.all([
    putKey(ssh, PRIVATE_KEY_PEM, `${app.domain}.pem`),
    putKey(ssh, CERTIFICATE_PEM, `${app.domain}.crt`),
    putKey(ssh, ISSUER_PEM, `DigiCertCA.crt`),
  ]);
}

module.exports = certificateRefresh;
