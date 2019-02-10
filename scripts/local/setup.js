'use strict';

const setupWordpress = require('./setup/wordpress');
const logger = require('../helpers/logger');

logger.info('Setting up local dev environment...')

Promise.all([
    setupWordpress()
  ])
  .then(() => logger.success('Completed successfully!'))
  .catch(logger.fatal);