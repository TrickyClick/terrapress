#!/bin/bash
if [ ! -n "${DOMAIN+x}" ]; then
  echo "[APACHE] FATAL ERROR: DOMAIN missing"
  exit 1
fi

if [ ! -n "${SUPPORT_EMAIL+x}" ]; then
  echo "[APACHE] FATAL ERROR: SUPPORT_EMAIL missing"
  exit 1
fi

if [ ! -n "${WEB_ROOT+x}" ]; then
  echo "[APACHE] FATAL ERROR: WEB_ROOT missing"
  exit 1
fi

if [ ! -n "${CERTIFICATES_PATH+x}" ]; then
  echo "[APACHE] FATAL ERROR: CERTIFICATES_PATH missing"
  exit 1
fi

SITES_ENABLED="/etc/apache2/sites-enabled"
SITES_AVAILABLE="/etc/apache2/sites-available"
HTTP_CONFIG="
<VirtualHost *:80>
  ServerAdmin $SUPPORT_EMAIL
  DocumentRoot $WEB_ROOT
  ServerName $DOMAIN

  <Directory $WEB_ROOT>
    Options +FollowSymlinks
    AllowOverride All
    Require all granted
  </Directory>

  ErrorLog \${APACHE_LOG_DIR}/$DOMAIN-error.log
  CustomLog \${APACHE_LOG_DIR}/$DOMAIN-access.log combined

  RewriteEngine on
  RewriteCond %{SERVER_NAME} =$DOMAIN [OR]
  RewriteCond %{SERVER_NAME} =www.$DOMAIN
  RewriteRule ^ https://$DOMAIN%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
<IfModule mod_ssl.c>
  <VirtualHost *:443>
    ServerAdmin $SUPPORT_EMAIL
    DocumentRoot $WEB_ROOT
    ServerName $DOMAIN

    <Directory $WEB_ROOT>
      Options +FollowSymlinks
      AllowOverride All
      Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/$DOMAIN-error.log
    CustomLog \${APACHE_LOG_DIR}/$DOMAIN-access.log combined

    SSLEngine on
    SSLCertificateFile $CERTIFICATES_PATH/$DOMAIN.crt
    SSLCertificateKeyFile $CERTIFICATES_PATH/$DOMAIN.pem
    SSLCertificateChainFile $CERTIFICATES_PATH/DigiCertCA.crt
  </VirtualHost>
</IfModule>
"

echo "[APACHE] Configuring modules"
a2enmod php7.0
a2enmod rewrite
a2enmod ssl
a2enmod http2

echo "[APACHE] Saving settings for $DOMAIN"
echo "$HTTP_CONFIG" > $SITES_AVAILABLE/$DOMAIN.conf
rm $SITES_ENABLED/*
a2ensite $DOMAIN
