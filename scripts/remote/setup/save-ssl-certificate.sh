#!/bin/bash
if [ ! -n "${DOMAIN+x}" ]; then
  echo "[SSL] FATAL ERROR: DOMAIN missing"
  exit 1
fi

if [ ! -n "${PRIVATE_KEY_PEM+x}" ]; then
  echo "[SSL] FATAL ERROR: PRIVATE_KEY_PEM missing"
  exit 1
fi

if [ ! -n "${CERTIFICATE_PEM+x}" ]; then
  echo "[SSL] FATAL ERROR: CERTIFICATE_PEM missing"
  exit 1
fi

if [ ! -n "${ISSUER_PEM+x}" ]; then
  echo "[SSL] FATAL ERROR: ISSUER_PEM missing"
  exit 1
fi

if [ ! -n "${CERTIFICATES_PATH+x}" ]; then
  echo "[SSL] FATAL ERROR: CERTIFICATES_PATH missing"
  exit 1
fi

mkdir -p $CERTIFICATES_PATH
echo "$PRIVATE_KEY_PEM" > "$CERTIFICATES_PATH/$DOMAIN.pem"
echo "$CERTIFICATE_PEM" > "$CERTIFICATES_PATH/$DOMAIN.crt"
echo "$ISSUER_PEM" > "$CERTIFICATES_PATH/DigiCertCA.crt"