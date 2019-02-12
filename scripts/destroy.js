'use strict';

const terminal = require('./helpers/terminal');
const logger = require('./helpers/logger');
const terraform = require('./helpers/terraform');

const autoApprove = !!process.env.AUTO_APPROVE;

const destroy = async () => {
  logger.warning('Destroying the infrastructure!');
  logger.question(`Are you sure that you want to continue? Type "DESTROY" if you wish to continue:`);

  const confirm = await terminal.textInput();
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

destroy()
  .then(process.exit)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });