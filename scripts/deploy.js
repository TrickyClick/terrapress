'use strict';

const logger = require('./helpers/logger');
const terraform = require('./helpers/terraform');
const installDependencies = require('./remote/install');
const certificateRefresh = require('./remote/certificate/refresh');

const deploy = async () => {
  logger.info('Adding SSH key to DigitalOcean');
  const sshPlan = terraform.getSshPlan();
  await sshPlan.apply();

  logger.info('Provisioning DigitalOcean droplet');
  const servicePlan = terraform.getServicePlan();

  if(await servicePlan.apply()) {
    await logger.sleep(5, 'Terraform: waiting 5s for resource to be created...');
    await installDependencies();
  }

  await certificateRefresh();

  logger.info('Registering server on GitHub');
  const githubPlan = await terraform.getGithubPlan();
  await githubPlan.apply();
}

deploy()
  .then(() => {
    logger.success('Deployment complete!');
    process.exit();
  })
  .catch(console.error);