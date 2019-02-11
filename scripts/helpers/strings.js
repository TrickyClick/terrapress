'use strict';

const fs = require('fs');
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

const replaceVariables = (template, variables) => {
  const keys = Object.keys(variables);
  if(!keys.length) {
    return template;
  }

  return keys.reduce((str, key) => {
    const matcher = new RegExp(`%${key}%`, 'g');
    const replacer = variables[key];

    return str.replace(matcher, replacer);
  }, template);
}

const renderTemplate = (path, variables = {}) => {
  const template = fs.readFileSync(path, 'utf8');
  return replaceVariables(template, variables);
}

module.exports = {
  replaceLinks,
  randomString,
  renderTemplate,
  replaceVariables,
};