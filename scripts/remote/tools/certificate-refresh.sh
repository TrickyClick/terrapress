#!/bin/bash
set -e

ROOT="$PWD/$( dirname "${BASH_SOURCE[0]}" )"
ROOT=$ROOT source $ROOT/../config.env
source $ROOT/../../lib/functions.sh

cd $ROOT/../../../terraform/service
HOST_IP=$(terraform output ip)

# Validate env variables
if [ -f "$ROOT/../../secrets.env" ]; then
  source "$ROOT/../../secrets.env"
fi

env_variable_defined "CLOUDFLARE_EMAIL"
env_variable_defined "CLOUDFLARE_TOKEN"

echo "[SETUP] Rerfreshing ${DOMAIN} certificate"

#######################################################
## ISSUE SSL CERTIFICATE
#######################################################

echo "[TERRAFORM] Issue domain certificate"
cd $ROOT/../../../terraform/certificate
if [ ! -d ".terraform" ]; then
  terraform init
fi

TF_VAR_support_email=$SUPPORT_EMAIL \
TF_VAR_domain=$DOMAIN \
TF_VAR_cloudflare_token=$CLOUDFLARE_TOKEN \
TF_VAR_cloudflare_email=$CLOUDFLARE_EMAIL \
   terraform apply -auto-approve -input=false

PRIVATE_KEY_PEM=$(terraform output private_key_pem)
CERTIFICATE_PEM=$(terraform output certificate_pem)
ISSUER_PEM=$(terraform output issuer_pem)

#######################################################
### SAVE SSL CERTIFICATE
#######################################################

echo "[SETUP] Save SSL certificate"
cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  DOMAIN=\"$DOMAIN\" \
  CERTIFICATES_PATH=\"$CERTIFICATES_PATH\" \
  PRIVATE_KEY_PEM=\"$PRIVATE_KEY_PEM\" \
  CERTIFICATE_PEM=\"$CERTIFICATE_PEM\" \
  ISSUER_PEM=\"$ISSUER_PEM\" \
  bash -s" < ../setup/save-ssl-certificate.sh