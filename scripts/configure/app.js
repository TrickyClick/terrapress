'use strict';

const fs = require('fs');

const { PATH_APP_CONFIG } = require('../config');
const terminal = require('../helpers/terminal');

const repoRegex = /^git@github\.com:.*\/.*\.git$/;
const domainRegex = /^(?!(www))[a-z0-9][a-z0-9-]{1,61}[a-z0-9]\.[a-z]{2,}(\.[a-z]{2,})?$/i;

const askForDomain = async defaultValue => {
  terminal.yellow('Enter you desired domain name: ');
  const value = await terminal.inputField({
    cancelable: true,
    default: defaultValue,
  }).promise;
  terminal('\n');

  return value;
}

const askRepository = async defaultValue => {
  terminal.yellow('What is your project\'s GitHub repository: ');
  const value = await terminal.inputField({
    default: defaultValue || 'git@github.com:',
    cancelable: true,
  }).promise;
  terminal('\n');

  return value;
}

const parseRepoUri = uri => {
  const [_, path] = uri.split(':');
  const [organisation, name] = path.split('/');

  return {
    organisation,
    repository: name.replace(/\.git$/, ''),
  }
}

const configureApp = async () => {
  let config = {};

  terminal.brightRed('\nApp configuration.\n\n');
  terminal.cyan(
    `These values will be saved in. ${PATH_APP_CONFIG},\n` +
    'none of these values exposes access information and is stored\n' +
    'in your repository\n\n'
  );
  
  if(fs.existsSync(PATH_APP_CONFIG)) {
    config = require(PATH_APP_CONFIG);
    terminal.yellow(`Configuration found in ${PATH_APP_CONFIG}\n`);
    terminal.bold('Do you want to overwrite it?');
    const overwrite = await terminal.confirm(true);

    if(!overwrite) {
      return;
    }
  }

  let domain = await askForDomain(config.domain);
  while(!domainRegex.test(domain)) {
    terminal.red('\nInvalid domain name: ');
    terminal.bold(`${domain}\n`)
    terminal.red('Remove the ');
    terminal.bold('www');
    terminal.red(' prefix if you have it!\n');
    domain = await askForDomain(domain);
  }
  
  let repositoryUrl = await askRepository(config.repositoryUrl);
  while(!repoRegex.test(repositoryUrl)) {
    terminal.red('\nEnter a valid GitHub SSH repo URI like:\n');
    terminal.bold('\n\tgit@github.com:user/repo.git\n');
    repositoryUrl = await askRepository(repositoryUrl);
  }
  
  const { organisation, repository } = parseRepoUri(repositoryUrl)
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
  
  terminal.green('\nThe following configuration will be saved:\n\n')
  
  Object.keys(data).forEach(key =>
    terminal.white(`\t${key}: `) &&
    terminal.gray(`${data[key]}\n`)
  );
  
  terminal.brightRed(`\nDoes this look OK?`);
  const confirm = await terminal.confirm(true);
  
  if(confirm) {
    fs.writeFileSync(PATH_APP_CONFIG, JSON.stringify(data));
  }
}

module.exports = configureApp;