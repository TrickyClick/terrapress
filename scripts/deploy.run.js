'use strict';

const logger = require('./helpers/logger');
const terraform = require('./helpers/terraform');
const installDependencies = require('./install');
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

  await codeClone.run();
  await wordpressSetup.run();
  await dbSetup.run();
  await apacheSetup.run();
  await phpSetup.run();
  await apacheRestart.run();

  logger.success('Deployment complete!');
};

module.exports = {
  run: deploy,
  help: 'Creates infrastructure, setups server and installs WordPress',
}