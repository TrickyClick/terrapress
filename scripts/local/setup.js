'use strict';

const setupWordpress = require('./setup/wordpress');

logger.info('Setting up local dev environment...')

Promise.all([
    setupWordpress()
  ])
  .then(() => logger.success('Completed successfully!'))
  .catch(logger.fatal);