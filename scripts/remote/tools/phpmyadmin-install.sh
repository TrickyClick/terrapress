#!/bin/bash
set -e

ROOT="$PWD/$( dirname "${BASH_SOURCE[0]}" )"
ROOT=$ROOT source $ROOT/../config.env

HOST_IP=$(cd $ROOT/../../../terraform/service && terraform output ip)
SOURCE="https://files.phpmyadmin.net/phpMyAdmin/4.8.4/phpMyAdmin-4.8.4-english.tar.gz"

echo "[PHPMYADMIN] Installing..."

cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "\
  mkdir -p $CODEBASE/.tmp &&\
  curl -s -L $SOURCE --output $CODEBASE/.tmp/phpmyadmin.tar.gz &&\
  tar -zxf $CODEBASE/.tmp/phpmyadmin.tar.gz --directory $CODEBASE/.tmp/ &&\
  mv -f $CODEBASE/.tmp/phpMyAdmin-4.8.4-english $WEB_ROOT/phpmyadmin &&\
  chown -R www-data:www-data $WEB_ROOT/phpmyadmin &&\
  rm -rf $CODEBASE/.tmp"

echo "[PHPMYADMIN] Done.."