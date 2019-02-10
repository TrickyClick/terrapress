'use strict';

const terminal = require('./helpers/terminal');
const configureApp = require('./configure/app');
const configureSecrets = require('./configure/secrets');

const configure = async () => {
  terminal.brightBlue('Welcome to ultimate-wordpress\'s configurator script\n');
  terminal.brightBlue('Please follow the instructions\n');

  await configureApp();
  await configureSecrets();
}

configure()
.then(() => {
  terminal.yellow('Configuration complete!\n');
  terminal.blue('Run: ');
  terminal.bold('npm run remote:setup ');
  terminal.blue('to install your server\n\n');
  process.exit();
})
.catch(console.error);