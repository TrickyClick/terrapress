'use strict';

const fs = require('fs');

const { PATH_APP_CONFIG } = require('../config');
const terminal = require('../helpers/terminal');

const sshRepoRegex = /^.*@[a-z0-9\-]{2,}\.[a-z]{2,}(\.[a-z]{2,})?:.*\/.*\.git$/i;
const httpRepoRegex = /^http(s)?:\/\/.*\.git$/i;
const domainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]\.[a-z]{2,}(\.[a-z]{2,})?$/i;
const gitHubRegex = /:([\/]{2})?(www\.)?github.com/i;

const isKnownUrl = url =>
  gitHubRegex.test(url);

const isValidRepoUrl = url =>
  sshRepoRegex.test(url) || httpRepoRegex.test(url);

const askForDomain = async defaultValue => {
  terminal.question('Domain name:');
  const value = await terminal.inputField({
    cancelable: true,
    default: defaultValue,
  }).promise;
  terminal('\n');

  return value.replace(/^www\./i, value);
}

const askRepository = async defaultValue => {
  terminal.question(`Git repository URL: `);
  const value = await terminal.inputField({
    default: defaultValue || 'git@github.com:',
    cancelable: true,
  }).promise;
  terminal('\n');

  return value;
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

  terminal.title('App configuration.');
  terminal.info(
    `These values will be saved in: "${PATH_APP_CONFIG}"
    none of which exposes access information and can be stored in your repository`
  );
  
  if(fs.existsSync(PATH_APP_CONFIG)) {
    config = require(PATH_APP_CONFIG);
    terminal.info(`Configuration found in "${PATH_APP_CONFIG}"`);
    terminal.question('Do you want to overwrite it?');
    const overwrite = await terminal.confirm(true);

    if(!overwrite) {
      return;
    }
  }

  let domain = await askForDomain(config.domain);
  while(!domainRegex.test(domain)) {
    terminal.err(`Invalid domain name: "${domain}"`);
    domain = await askForDomain(domain);
  }
  
  let repositoryUrl = await askRepository(config.repositoryUrl);
  while(!isValidRepoUrl(repositoryUrl)) {
    terminal.warning('Enter a valid GitHub SSH URL. Example:');
    terminal.info('git@github.com:yourUserName/yourRepositoryName.git or');
    terminal.info('https://github.com/yourUserName/yourRepositoryName.git');
    repositoryUrl = await askRepository(repositoryUrl);
  }

  const { organisation, repository } = parseRepositoryUrl(repositoryUrl);
  const codebase = `/var/www/${domain}`;
  
  const data = {
    domain,
    organisation,
    repository,
    repositoryUrl,
    codebase,
    webRoot: `${codebase}/wordpress`,
    certficatesPath: `/etc/ssl/${domain}`,
    terraformVersion: '0.11.10',
    uploadLimitMb: '25',
  }
  
  terminal.info('The following configuration will be saved:\n');

  Object.keys(data).forEach(key =>
    terminal.dataRow(key, data[key])
  );
  
  terminal.question('Does this look OK?');
  const confirm = await terminal.confirm(true);
  
  if(confirm) {
    fs.writeFileSync(PATH_APP_CONFIG, JSON.stringify(data));
  }
}

module.exports = initApp;