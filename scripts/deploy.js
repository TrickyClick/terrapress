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

const autoApprove = !!process.env.AUTO_APPROVE;

const deploy = async () => {
  logger.begin('Deplying infrastructure & code');

  const sshPlan = terraform.getSshPlan();
  await sshPlan.apply(autoApprove);

  const servicePlan = terraform.getServicePlan();
  const applyServicePlan = await servicePlan.apply(autoApprove);

  if(applyServicePlan) {
    await installDependencies();
  }

  await certificateRefresh(autoApprove);

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