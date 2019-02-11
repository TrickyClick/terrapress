<?php
  define( 'WP_HOME',          'https://%domain%' );
  define( 'WP_SITEURL',       'https://%domain%' );
  define( 'DB_NAME',          '%MYSQL_DATABASE%' );
  define( 'DB_USER',          '%MYSQL_USERNAME%' );
  define( 'DB_HOST',          'localhost' );
  define( 'DB_CHARSET',       'utf8' );
  define( 'DB_COLLATE',       '' );
  define( 'AUTH_KEY',         '%secret%' );
  define( 'SECURE_AUTH_KEY',  '%secret%' );
  define( 'LOGGED_IN_KEY',    '%secret%' );
  define( 'NONCE_KEY',        '%secret%' );
  define( 'AUTH_SALT',        '%secret%' );
  define( 'SECURE_AUTH_SALT', '%secret%' );
  define( 'LOGGED_IN_SALT',   '%secret%' );
  define( 'NONCE_SALT',       '%secret%' );
  define( 'WP_DEBUG',         false );

  $table_prefix = 'wp_';

  if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', dirname( __FILE__ ) . '/' );
  }

  require_once( ABSPATH . 'wp-db-config.php');
  require_once( ABSPATH . 'wp-settings.php' );