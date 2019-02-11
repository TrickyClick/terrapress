'use strict';

const crypto = require('crypto');

const replaceLinks = (text, originDomain, replaceWith) => {
  const regexDomain = originDomain.replace('.', '\\.');
  const rawRegex = new RegExp(`http(s)?:\/\/${regexDomain}`, 'gi');
  const encodedRegex = new RegExp(`http(s)?${encodeURIComponent('://')}${regexDomain}`, 'gi');

  return text.replace(rawRegex, replaceWith).replace(encodedRegex, replaceWith);
};

const randomString = (len = 20) =>
  crypto.randomBytes(Math.ceil(len/2))
    .toString('hex')
    .substr(0, len);

module.exports = {
  replaceLinks,
  randomString,
};