'use strict';

const logger = require('../helpers/logger');
const terraform = require('../helpers/terraform');
const installDependencies = require('./install');
const certificateRefresh = require('./certificate/refresh');
const codeClone = require('./code/clone');
const wordpressSetup = require('./wordpress/setup');
const dbSetup = require('./db/setup');
const apacheSetup = require('./apache/setup');
const apacheRestart = require('./apache/restart');
const phpSetup = require('./php/setup');

const autoApprove = !!process.env.AUTO_APPROVE;

const remoteDeploy = async () => {
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

  logger.success('Deployment complete!');
}

module.exports = remoteDeploy;