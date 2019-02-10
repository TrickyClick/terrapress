#!/bin/bash
if [ ! -n "${TERRAFORM_VERSION+x}" ]; then
  echo "[INSTALL] FATAL ERROR: TERRAFORM_VERSION missing"
  exit 1
fi

if [ ! -n "${DOMAIN+x}" ]; then
  echo "[INSTALL] FATAL ERROR: DOMAIN missing"
  exit 1
fi

echo "[INSTALL] Updating aptitude"
apt-get -qq update

echo "[INSTALL] Installing LAMP stack"
apt-get -qq install -y mariadb-client mariadb-server
apt-get -qq install -y php7.0 php7.0-mysql php7.0-gd php7.0-curl
apt-get -qq install -y apache2 libapache2-mod-php7.0

echo "[INSTALL] Installing DEV tools"
apt-get -qq install -y git curl

echo "[INSTALL] Generate public key"
if [ ! -f "$HOME/.ssh/id_rsa" ]; then
  PASSWORD=$(echo -n $(date) | sha512sum)
  yes y | ssh-keygen -N "$PASSWORD" -t rsa -C "$DOMAIN" -f "$HOME/.ssh/id_rsa" -q -P ""
  echo
else
  echo " ...skipped"
fi

echo "[INSTALL] Setting up git"
git config --global core.editor "vim"
