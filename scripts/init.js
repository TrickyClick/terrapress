'use strict';

const terminal = require('./helpers/terminal');
const initApp = require('./init/app');
const initSecrets = require('./init/secrets');

const init = async () => {
  terminal.info(
    `Welcome to ultimate-wordpress's configurator script
    Please follow the instructions`
  )
  terminal.brightBlue();

  await initApp();
  await initSecrets();
}

init()
  .then(() => {
    terminal.success('Terrapress initialisation complete!');
    terminal.run('npm run remote:setup', 'to install your server');
    terminal.run('npm run local:setup', 'to setup for local dev');
    process.exit();
  })
  .catch(console.error);