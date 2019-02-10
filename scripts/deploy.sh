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

#######################################################
### APPLY DIGITAL OCEAN INFRASTRUCTURE
#######################################################

echo "[TERRAFORM] DigitalOcean SSH access"
cd "${ROOT}/../terraform/ssh"
if [ ! -d ".terraform" ]; then
  terraform init
fi

TF_VAR_digitalocean_token=$DIGITALOCEAN_TOKEN \
TF_VAR_public_key=$SSH_KEY \
TF_VAR_public_key_name=$SSH_KEY_NAME \
  terraform apply -auto-approve

FINGERPRINT=$(terraform output fingerprint)

echo "[TERRAFORM] DigitalOcean service"
cd "${ROOT}/../terraform/service"
if [ ! -d ".terraform" ]; then
  terraform init
fi

TF_VAR_domain=$DOMAIN \
TF_VAR_digitalocean_token=$DIGITALOCEAN_TOKEN \
TF_VAR_fingerprint=$FINGERPRINT \
TF_VAR_cloudflare_token=$CLOUDFLARE_TOKEN \
TF_VAR_cloudflare_email=$CLOUDFLARE_EMAIL \
  terraform apply -auto-approve

HOST_IP=$(terraform output ip)

echo "[TERRAFORM] Waiting 15s for resource to finish creating..."
sleep 15s

#######################################################
### INSTALL DEPENDENCIES ON DIGITALOCEAN DROPLET
#######################################################

echo "[SETUP] Install server dependencies"
cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  DOMAIN=$DOMAIN \
  TERRAFORM_VERSION=$TERRAFORM_VERSION \
  bash -s" < remote/setup/install.sh

SERVER_KEY=$(ssh -oStrictHostKeyChecking=no root@$HOST_IP 'cat $HOME/.ssh/id_rsa.pub')

#######################################################
## ISSUE SSL CERTIFICATE
#######################################################

cd $ROOT
sh ./remote/tools/certificate-refresh.sh

#######################################################
## ADD PUB KEY TO GITHUB
#######################################################

echo "[TERRAFORM] Register server on GitHub"
cd "${ROOT}/../terraform/github"
if [ ! -d ".terraform" ]; then
  terraform init
fi

TF_VAR_server_key=$SERVER_KEY \
TF_VAR_repository_name=$GITHUB_REPOSITORY \
TF_VAR_domain=$DOMAIN \
TF_VAR_github_token=$GITHUB_TOKEN \
TF_VAR_github_org=$GITHUB_ORG \
  terraform apply -auto-approve

#######################################################
## CLONE SOURCES
#######################################################

echo "[SETUP] Clone sources"
cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  CODEBASE=$CODEBASE \
  REPOSITORY_URI=$REPOSITORY_URI \
  GITHUB_REPOSITORY=$GITHUB_REPOSITORY \
  bash -s" < remote/setup/clone.sh

#######################################################
## SETUP WORDPRESS
#######################################################

echo "[SETUP] Config Wordpress"
cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  DOMAIN=$DOMAIN \
  CODEBASE=$CODEBASE \
  WEB_ROOT=$WEB_ROOT \
  bash -s" < remote/setup/wordpress.sh

#######################################################
## CONFIG DATABASE
#######################################################

echo "[SETUP] Config database"
cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  WEB_ROOT=$WEB_ROOT \
  bash -s" < remote/setup/database.sh

#######################################################
## CONFIG APACHE
#######################################################

echo "[SETUP] Config Apache"
cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  SUPPORT_EMAIL=$SUPPORT_EMAIL \
  DOMAIN=$DOMAIN \
  CERTIFICATES_PATH=$CERTIFICATES_PATH \
  WEB_ROOT=$WEB_ROOT \
  bash -s" < remote/setup/apache.sh

#######################################################
## CONFIG PHP
#######################################################

echo "[SETUP] Config PHP"
cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  UPLOAD_LIMIT_MB=$UPLOAD_LIMIT_MB \
  bash -s" < remote/setup/php.sh

echo "[SETUP] Restarting apache"
sh ./remote/tools/apache-restart.sh

echo "[SETUP] Completed Successfully!"