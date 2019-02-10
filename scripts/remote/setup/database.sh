#!/bin/bash

echo "[DATABASE] Configuring..."
if [ ! -n "${WEB_ROOT+x}" ]; then
  echo "[DATABASE] FATAL ERROR: WEB_ROOT missing"
  exit 1
fi

if [ -f "$WEB_ROOT/wp-db-config.php" ]; then
  echo " ...skipped"
  exit 0
fi

echo "[DATABASE] Generating database credentials"
# Generate password
PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*()-=_+' | fold -w 64 | head -n 1)

DB_CONFIG="<?php
  define( 'DB_PASSWORD', '$PASSWORD' );"

echo "[DATABASE] Creating database and user"
SQL="
  CREATE DATABASE
    IF NOT EXISTS wordpress
    CHARACTER SET = 'utf8';

  GRANT ALL PRIVILEGES
    ON wordpress.*
    TO 'wordpress'@'localhost'
    IDENTIFIED BY '$PASSWORD';

  FLUSH PRIVILEGES;
"

mysql -uroot -e "$SQL"

echo "[DATABASE] Saving Wordpress Configuration"
echo "$DB_CONFIG" > $WEB_ROOT/wp-db-config.php
