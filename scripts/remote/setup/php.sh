#!/bin/bash
if [ ! -n "${UPLOAD_LIMIT_MB+x}" ]; then
  echo "[PHP] FATAL ERROR: UPLOAD_LIMIT_MB missing"
  exit 1
fi

echo "[PHP] Updating php.ini"
echo "[PHP] Setting PHP upload filesize to ${UPLOAD_LIMIT_MB}M"
sed -ri 's/^(upload_max_filesize = )[0-9]+(M.*)$/\1'${UPLOAD_LIMIT_MB}'\2/' /etc/php/7.0/apache2/php.ini
sed -ri 's/^(post_max_size = )[0-9]+(M.*)$/\1'${UPLOAD_LIMIT_MB}'\2/' /etc/php/7.0/apache2/php.ini
