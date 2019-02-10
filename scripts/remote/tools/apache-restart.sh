#!/bin/bash
set -e

ROOT="$PWD/$( dirname "${BASH_SOURCE[0]}" )"
ROOT=$ROOT source $ROOT/../config.env

cd $ROOT/../../../terraform/service
HOST_IP=$(terraform output ip)

echo "[APACHE] Restarting safely..."
ssh -oStrictHostKeyChecking=no root@$HOST_IP "service apache2 restart"

echo "[APACHE] Done."
