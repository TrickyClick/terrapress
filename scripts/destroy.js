'use strict';

const { app, secrets } = require('./config');
const logger = require('./helpers/logger');
const getConnection = require('./helpers/ssh');
const installDependencies = require('./remote/install');
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

  const { FINGERPRINT } = sshPlan.output;
  const { IP } = servicePlan.output;
//   const { serverKey }
// SERVER_KEY=$(ssh -oStrictHostKeyChecking=no root@$HOST_IP 'cat $HOME/.ssh/id_rsa.pub')

// echo "[DESTROY] Unregister server from github"
// cd "${ROOT}/../terraform/github"

// TF_VAR_domain=$DOMAIN \
// TF_VAR_server_key=$SERVER_KEY \
// TF_VAR_repository_name=$GITHUB_REPOSITORY \
// TF_VAR_github_token=$GITHUB_TOKEN \
// TF_VAR_github_org=$GITHUB_ORG \
//   terraform destroy -auto-approve

// echo "[DESTROY] Domain certificate"
// cd "${ROOT}/../terraform/certificate"

// TF_VAR_support_email=$SUPPORT_EMAIL \
// TF_VAR_domain=$DOMAIN \
// TF_VAR_cloudflare_token=$CLOUDFLARE_TOKEN \
// TF_VAR_cloudflare_email=$CLOUDFLARE_EMAIL \
//    terraform destroy -auto-approve -input=false

// echo "[DESTROY] Digitalocean droplet"
// cd "${ROOT}/../terraform/service"

// TF_VAR_support_email=$SUPPORT_EMAIL \
// TF_VAR_domain=$DOMAIN \
// TF_VAR_digitalocean_token=$DIGITALOCEAN_TOKEN \
// TF_VAR_fingerprint=$FINGERPRINT \
// TF_VAR_cloudflare_token=$CLOUDFLARE_TOKEN \
// TF_VAR_cloudflare_email=$CLOUDFLARE_EMAIL \
//   terraform destroy -auto-approve

// echo "[DESTROY] Completed Successfully!"
};