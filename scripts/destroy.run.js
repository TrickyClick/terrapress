'use strict';

const logger = require('./helpers/logger');
const terraform = require('./helpers/terraform');

const autoApprove = !!process.env.AUTO_APPROVE;

const destroy = async () => {
  logger.warning('Destroying the infrastructure!');
  const confirm = await logger.textInput('Type "DESTROY", if you wish to continue:');

  if(!/^destroy$/gi.test(confirm)) {
    logger.warning('Aborting.');
    return;
  }

  await (await terraform.getGithubPlan()).destroy(autoApprove);
  await terraform.getCertificatePlan().destroy(autoApprove);

  logger.warning('-------------------------------------------------------------');
  logger.warning('Destroying service infrastructure!');
  logger.warning('YOUR SERVER WILL STOP TO EXIST! NO RETURN BEYOND THIS POINT!');
  logger.warning('-------------------------------------------------------------');

  if(!await terraform.getServicePlan().destroy()) {
    logger.warning('Aborting.');
  } else {
    logger.success('Infrastructure was destroyed!')
  }
};

module.exports = {
  run: destroy,
  help: 'Destroys the infrastructure and the configured website',
};
