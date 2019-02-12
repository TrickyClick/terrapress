'use strict';

const setupWordpress = require('./setup/wordpress');
const logger = require('../helpers/logger');

logger.info('Setting up local dev environment...')

const localSetup = async() => {
  await setupWordpress();
  logger.success('Local setup completed.');
}

module.exports = localSetup;