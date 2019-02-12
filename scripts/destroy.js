'use strict';

const terminal = require('./helpers/terminal');
const logger = require('./helpers/logger');
const terraform = require('./helpers/terraform');

const destroy = async () => {
  logger.warning('Destroying the infrastructure!');
  logger.question(`Are you sure that you want to continue? Type "DESTROY" if you wish to continue:`);

  const confirm = await terminal.textInput();
  if(confirm !== 'DESTROY') {
    logger.warning('Aborting.');
    return;
  }

  logger.info('Destroying GitHub resources');
  const githubPlan = await terraform.getGithubPlan();
  await githubPlan.destroy(true);

  logger.info('Destroying certificates');
  await terraform.getCertificatePlan().destroy(true);

  logger.info('Destroying DigitalOcean droplet');
  logger.warning('YOUR SERVER WILL STOP TO EXIST! NO RETURN BEYOND THIS POINT...');
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