'use strict';

const { colored } = require('../helpers/logger');
const setupWordpress = require('./setup/wordpress');

const log = colored('redBright', 'SETUP');

log('Setting up local dev environment...')

Promise.all([
    setupWordpress()
  ])
  .then(() => log('Completed successfully!'))
  .catch(console.error);