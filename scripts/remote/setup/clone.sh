#!/bin/bash

if [ ! -n "${REPOSITORY_URI+x}" ]; then
  echo "[CLONE] FATAL ERROR: REPOSITORY_URI missing"
  exit 1
fi

if [ ! -n "${CODEBASE+x}" ]; then
  echo "[CLONE] FATAL ERROR: CODEBASE missing"
  exit 1
fi

if [ ! -n "${GITHUB_REPOSITORY+x}" ]; then
  echo "[CLONE] FATAL ERROR: GITHUB_REPOSITORY missing"
  exit 1
fi

echo "[CLONE] Cloning $REPOSITORY_URI into $CODEBASE"
if [ ! -d $CODEBASE ]; then
  GIT_SSH_COMMAND="ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
  git clone $REPOSITORY_URI $CODEBASE --quiet
  
  echo "[CLONE] Updating CODEBASE owner to www-data:www-data"
  chown -R www-data:www-data $CODEBASE
  ln -s $CODEBASE /root/$GITHUB_REPOSITORY
else
  echo " ...skipped"
fi