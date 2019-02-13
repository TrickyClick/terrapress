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
    logger.run('npm run deploy', 'to setup the infrastrcture and deploy the server');
    logger.run('npm run setup', 'to setup for local dev');
    process.exit();
  })
  .catch(error => {
    logger.fatal(error.stack);
    process.exit(1);
  });