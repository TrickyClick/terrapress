#!/bin/bash
set -e

ROOT="$PWD/$( dirname "${BASH_SOURCE[0]}" )"
ROOT=$ROOT source $ROOT/../config.env

HOST_IP=$(cd $ROOT/../../../terraform/service && terraform output ip)

echo "[PHPMYADMIN] Removing..."

cd $ROOT
ssh -oStrictHostKeyChecking=no root@$HOST_IP "rm -rf $WEB_ROOT/phpmyadmin"

echo "[PHPMYADMIN] Done."