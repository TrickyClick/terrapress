'use strict';

const logger = require('./helpers/logger');
const terraform = require('./helpers/terraform');
const installDependencies = require('./remote/install.run');
const certificateRefresh = require('./remote/certificate/refresh.run');
const codeClone = require('./remote/code/clone.run');
const wordpressSetup = require('./remote/wordpress/setup.run');
const dbSetup = require('./remote/db/setup.run');
const apacheSetup = require('./remote/apache/setup.run');
const apacheRestart = require('./remote/apache/restart.run');
const phpSetup = require('./remote/php/setup.run');

const autoApprove = !!process.env.AUTO_APPROVE;

const deploy = async () => {
  logger.begin('Deplying infrastructure & code');

  const sshPlan = terraform.getSshPlan();
  await sshPlan.apply(autoApprove);

  const servicePlan = terraform.getServicePlan();
  const applyServicePlan = await servicePlan.apply(autoApprove);

  if(applyServicePlan) {
    await installDependencies.run();
  }

  await certificateRefresh.run(autoApprove);

  const githubPlan = await terraform.getGithubPlan();
  await githubPlan.apply(applyServicePlan);

  await codeClone.run();
  await wordpressSetup.run();
  await dbSetup.run();
  await apacheSetup.run();
  await phpSetup.run();

  logger.success('Deployment complete!');
};

module.exports = {
  run: deploy,
  help: 'Creates infrastructure, setups server and installs WordPress',
}