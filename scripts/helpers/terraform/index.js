'use strict';

const TerraformPlan = require('./TerraformPlan');
const { app, secrets } = require('../../config');
const {
  DIGITALOCEAN_TOKEN,
  SSH_KEY_NAME,
  SSH_PUBLIC_KEY,
  CLOUDFLARE_TOKEN,
  CLOUDFLARE_EMAIL,
  GITHUB_TOKEN,
} = secrets;

module.exports = {
  TerraformPlan,
  getSshPlan() {
    return new TerraformPlan('ssh', {
      DIGITALOCEAN_TOKEN,
      SSH_KEY_NAME,
      SSH_PUBLIC_KEY
    });
  },
  getServicePlan() {
    const { FINGERPRINT } = this.getSshPlan().output;
    return new TerraformPlan('service', {
      FINGERPRINT,
      DOMAIN: app.domain,
      DIGITALOCEAN_TOKEN,
      CLOUDFLARE_EMAIL,
      CLOUDFLARE_TOKEN
    });
  },
  getCertificatePlan() {
    return new TerraformPlan('certificate', {
      SUPPORT_EMAIL: app.supportEmail,
      DOMAIN: app.domain,
      CLOUDFLARE_EMAIL,
      CLOUDFLARE_TOKEN,
    });
  },
  async getGithubPlan() {
    const getConnection = require('../ssh');
    const ssh = await getConnection();
    const SERVER_KEY = await ssh.exec('cat $HOME/.ssh/id_rsa.pub');
  
    return new TerraformPlan('github', {
      GITHUB_REPOSITORY: app.repository,
      GITHUB_ORG: app.organisation,
      GITHUB_TOKEN,
      SERVER_KEY,
      DOMAIN: app.domain,
    });
  },
};