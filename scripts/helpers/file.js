const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const unzipLib = require('unzipper');
const shell = require('shelljs');

const { logger } = require('./logger');

const isHttps = /^https:\/\//i;

const download = (url, dest) => new Promise((resolve, reject) => {
  shell.mkdir('-p', path.dirname(dest));

  const lib = isHttps.test(url) ? https : http;
  const output = fs.createWriteStream(dest);

  logger.info(`Downloading: ${url}`);

  const request = lib.get(url, (res) => {
    res.pipe(output);
    output.on('finish', () => {
      output.close();
      return resolve(dest);
    });
  });

  request.on('error', (error) => {
    output.close();
    fs.unlink(dest);
    return reject(error);
  });
});

const unzip = (source, dest) => new Promise((resolve, reject) => {
  shell.mkdir('-p', path.dirname(dest));

  logger.info(`Unzipping: ${source}`);

  fs.createReadStream(source)
    .pipe(unzipLib.Extract({ path: dest }))
    .on('finish', resolve)
    .on('error', reject);
});

module.exports = {
  download,
  unzip,
};
