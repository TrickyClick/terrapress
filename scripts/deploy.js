'use strict';

const logger = require('./helpers/logger');
const terraform = require('./helpers/terraform');

const installDependencies = require('./remote/install');
const certificateRefresh = require('./remote/certificate/refresh');
const codeClone = require('./remote/code/clone');
const wordpressSetup = require('./remote/wordpress/setup');
const dbSetup = require('./remote/db/setup');
const apacheSetup = require('./remote/apache/setup');
const apacheRestart = require('./remote/apache/restart');
const phpSetup = require('./remote/php/setup');

const deploy = async () => {
  logger.info('Adding SSH key to DigitalOcean');
  const sshPlan = terraform.getSshPlan();
  await sshPlan.apply();

  logger.info('Provisioning DigitalOcean droplet');
  const servicePlan = terraform.getServicePlan();
  const applyServicePlan = await servicePlan.apply();

  if(applyServicePlan) {
    await installDependencies();
  }

  await certificateRefresh();

  logger.info('Registering server on GitHub');
  const githubPlan = await terraform.getGithubPlan();
  await githubPlan.apply(applyServicePlan);

  await codeClone();
  await wordpressSetup();
  await dbSetup();
  await apacheSetup();
  await phpSetup();
  await apacheRestart();
}

deploy()
  .then(() => {
    logger.success('Deployment complete!');
    process.exit();
  })
  .catch(err => {
    logger.fatal(err.stack);
    process.exit(1);
  });