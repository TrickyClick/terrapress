'use strict';

const fs = require('fs');

const { PATH_APP_CONFIG } = require('../config');
const terminal = require('../helpers/terminal');
const logger = require('../helpers/logger');

const sshRepoRegex = /^.*@[a-z0-9\-]{2,}\.[a-z]{2,}(\.[a-z]{2,})?:.*\/.*\.git$/i;
const httpRepoRegex = /^http(s)?:\/\/.*\.git$/i;
const domainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]\.[a-z]{2,}(\.[a-z]{2,})?$/i;
const gitHubRegex = /(@|:\/\/)+(www\.)?github.com/i;

const isValidRepoUrl = url =>
  sshRepoRegex.test(url) || httpRepoRegex.test(url);

const askForDomain = async defaultValue => {
  logger.question('Domain name:');
  return terminal.textInput(defaultValue)
    .then(value => value.replace(/^www\./i, ''));
}

const askRepository = defaultValue => {
  logger.question(`Git repository URL: `);
  return terminal.textInput(defaultValue || 'git@github.com:');
}

const parseRepositoryUrl = url => {
  if(!gitHubRegex.test(url)) {
    return {};
  }

  const schemaSeparator = sshRepoRegex.test(url) ? ':' : /github\.com\//i;
  const [_, path] = url.split(schemaSeparator);
  const [organisation, name] = path.split('/');
  
  return {
    organisation,
    repository: name.replace(/\.git$/, ''),
  }
}

const initApp = async () => {
  let config = {};

  logger.title('App configuration.');
  logger.info(
    `These values will be saved in: "${PATH_APP_CONFIG}"
    none of which exposes access information and can be stored in your repository`
  );
  
  if(fs.existsSync(PATH_APP_CONFIG)) {
    config = require(PATH_APP_CONFIG);
    logger.info(`Configuration found in "${PATH_APP_CONFIG}"`);
    logger.question('Do you want to overwrite it?');
    const overwrite = await terminal.confirm(true);

    if(!overwrite) {
      return;
    }
  }

  let domain = await askForDomain(config.domain);
  while(!domainRegex.test(domain)) {
    logger.error(`Invalid domain name: "${domain}"`);
    domain = await askForDomain(domain);
  }
  
  let repositoryUrl = await askRepository(config.repositoryUrl);
  while(!isValidRepoUrl(repositoryUrl)) {
    logger.warning('Enter a valid GitHub SSH URL. Example:');
    logger.info(`
      git@github.com:yourUserName/yourRepositoryName.git or
      https://github.com/yourUserName/yourRepositoryName.git`);
    repositoryUrl = await askRepository(repositoryUrl);
  }

  const { organisation, repository } = parseRepositoryUrl(repositoryUrl);
  
  const data = {
    domain,
    organisation,
    repository,
    repositoryUrl,
  };
  
  logger.info('The following configuration will be saved:\n');

  Object.keys(data).forEach(key =>
    logger.dataRow(key, data[key])
  );
  
  logger.question('\nDoes this look OK?');
  const confirm = await terminal.confirm(true);
  
  if(confirm) {
    fs.writeFileSync(PATH_APP_CONFIG, JSON.stringify(data));
  }
}

module.exports = initApp;