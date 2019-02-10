'use strict';

const logger = require('./helpers/logger');
const initApp = require('./init/app');
const initSecrets = require('./init/secrets');

const init = async () => {
  logger.info(
    `Welcome to ultimate-wordpress's configurator script
    Please follow the instructions`
  )

  await initApp();
  await initSecrets();
}

init()
  .then(() => {
    logger.success('Terrapress initialisation complete!');
    logger.run('npm run remote:setup', 'to install your server');
    logger.run('npm run local:setup', 'to setup for local dev');
    process.exit();
  })
  .catch(console.error);