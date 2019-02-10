'use strict';

const { app, secrets } = require('./config');
const logger = require('./helpers/logger');
const Terraform = require('./helpers/Terraform');
const {
  DIGITALOCEAN_TOKEN,
  SSH_KEY_NAME,
  SSH_PUBLIC_KEY,
  CLOUDFLARE_TOKEN,
  CLOUDFLARE_EMAIL,
} = secrets;

const deploy = async () => {
  logger.info('Adding SSH key to DigitalOcean');
  const sshPlan = new Terraform('ssh', {
    DIGITALOCEAN_TOKEN,
    SSH_KEY_NAME,
    SSH_PUBLIC_KEY
  });
  
  await sshPlan.apply();
  const { FINGERPRINT } = sshPlan.output;

  logger.info('Provisioning DigitalOcean droplet');
  const servicePlan = new Terraform('service', {
    FINGERPRINT,
    DOMAIN: app.domain,
    DIGITALOCEAN_TOKEN,
    CLOUDFLARE_EMAIL,
    CLOUDFLARE_TOKEN
  });

  if(await servicePlan.apply()) {
    await logger.sleep(15, 'Terraform: waiting 15s for resource to be created...');
  }
};

deploy()
  .then(() => {
    logger.success('Deployment complete!');
    process.exit();
  })
  .catch(console.error);