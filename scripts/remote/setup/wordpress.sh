#!/bin/bash
if [ ! -n "${CODEBASE+x}" ]; then
  echo "[WORDPRESS] FATAL ERROR: CODEBASE missing"
  exit 1
fi

if [ ! -n "${WEB_ROOT+x}" ]; then
  echo "[WORDPRESS] FATAL ERROR: WEB_ROOT missing"
  exit 1
fi

if [ ! -n "${DOMAIN+x}" ]; then
  echo "[DATABASE] FATAL ERROR: DOMAIN missing"
  exit 1
fi

function generate_secret() {
  cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*()-=_+' | fold -w 64 | head -n 1
}

SOURCE="https://wordpress.org/latest.tar.gz"

# Download wordpress
if [ ! -d $WEB_ROOT ]; then
  echo "[WORDPRESS] Downloading latest WordPress"
  mkdir -p $CODEBASE/.tmp
  curl -s -L $SOURCE --output $CODEBASE/.tmp/latest.tar.gz

  echo "[WORDPRESS] Setting up files..."
  cd $CODEBASE/.tmp
  tar -xzf latest.tar.gz
  rm -rf wordpress/wp-content
  rm wordpress/wp-config-sample.php
  mkdir -p $WEB_ROOT
  mv wordpress/* $WEB_ROOT/
  rm -rf $CODEBASE/.tmp

  echo "[WORDPRESS] Linking wp-content"
  ln -s $CODEBASE/src/wp-content $WEB_ROOT/wp-content
else
  echo "[WORDPRESS] Already installed"
fi

echo "[WORDPRESS] Generating wp-config"

WP_CONFIG="<?php
  # define( 'WP_HOME',          'https://$DOMAIN' );
  # define( 'WP_SITEURL',       'https://$DOMAIN' );
  define( 'DB_NAME',          'wordpress' );
  define( 'DB_USER',          'wordpress' );
  define( 'DB_HOST',          'localhost' );
  define( 'DB_CHARSET',       'utf8' );
  define( 'DB_COLLATE',       '' );
  define( 'AUTH_KEY',         '$(generate_secret)' );
  define( 'SECURE_AUTH_KEY',  '$(generate_secret)' );
  define( 'LOGGED_IN_KEY',    '$(generate_secret)' );
  define( 'NONCE_KEY',        '$(generate_secret)' );
  define( 'AUTH_SALT',        '$(generate_secret)' );
  define( 'SECURE_AUTH_SALT', '$(generate_secret)' );
  define( 'LOGGED_IN_SALT',   '$(generate_secret)' );
  define( 'NONCE_SALT',       '$(generate_secret)' );
  define( 'WP_DEBUG',         false );

  \$table_prefix = 'wp_';

  if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', dirname( __FILE__ ) . '/' );
  }

  require_once( ABSPATH . 'wp-db-config.php');
  require_once( ABSPATH . 'wp-settings.php' );"

echo "$WP_CONFIG" > $WEB_ROOT/wp-config.php

echo "[WORDPRESS] Updating ownership"
chown -R www-data:www-data $WEB_ROOT

echo "[WORDPRESS] Setup complete..."