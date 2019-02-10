#!/bin/bash
set -e

ROOT="$PWD/$( dirname "${BASH_SOURCE[0]}" )"
ROOT=$ROOT source $ROOT/remote/config.env
source $ROOT/lib/functions.sh

# Validate env variables
if [ -f "$ROOT/secrets.env" ]; then
  source "$ROOT/secrets.env"
fi

env_variable_defined "SSH_KEY"
env_variable_defined "DIGITALOCEAN_TOKEN"
env_variable_defined "GITHUB_TOKEN"
env_variable_defined "CLOUDFLARE_EMAIL"
env_variable_defined "CLOUDFLARE_TOKEN"

FINGERPRINT=$(cd "${ROOT}/../terraform/ssh" && terraform output fingerprint)
HOST_IP=$(cd "${ROOT}/../terraform/service" && terraform output ip)
SERVER_KEY=$(ssh -oStrictHostKeyChecking=no root@$HOST_IP 'cat $HOME/.ssh/id_rsa.pub')

echo "[DESTROY] Unregister server from github"
cd "${ROOT}/../terraform/github"

TF_VAR_domain=$DOMAIN \
TF_VAR_server_key=$SERVER_KEY \
TF_VAR_repository_name=$GITHUB_REPOSITORY \
TF_VAR_github_token=$GITHUB_TOKEN \
TF_VAR_github_org=$GITHUB_ORG \
  terraform apply -auto-approve

echo "[DESTROY] Domain certificate"
cd "${ROOT}/../terraform/certificate"

TF_VAR_support_email=$SUPPORT_EMAIL \
TF_VAR_domain=$DOMAIN \
TF_VAR_cloudflare_token=$CLOUDFLARE_TOKEN \
TF_VAR_cloudflare_email=$CLOUDFLARE_EMAIL \
   terraform apply -auto-approve -input=false

echo "[DESTROY] Digitalocean droplet"
cd "${ROOT}/../terraform/service"

TF_VAR_support_email=$SUPPORT_EMAIL \
TF_VAR_domain=$DOMAIN \
TF_VAR_digitalocean_token=$DIGITALOCEAN_TOKEN \
TF_VAR_fingerprint=$FINGERPRINT \
TF_VAR_cloudflare_token=$CLOUDFLARE_TOKEN \
TF_VAR_cloudflare_email=$CLOUDFLARE_EMAIL \
  terraform destroy -auto-approve

echo "[DESTROY] Completed Successfully!"