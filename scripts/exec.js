'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('./helpers/logger');

const ROOT_COMMANDS = ['local', 'remote'];
const cmd = process.argv[process.argv.length -1];
const [root, ...rest] = cmd.replace(/(\/|\.\.)/g, '').split(':');
rest[rest.length - 1] += '.js';

const target = path.resolve(__dirname, root, ...rest);
console.log('target', target);

if(!ROOT_COMMANDS.indexOf(root) || !fs.existsSync(target)) {
  logger.fatal(`Exec: Invalid command "${cmd}"`);
  process.exit(1);
}

const runner = require(target);

if(typeof runner !== 'function') {
  logger.fatal(`Exec: Runner in "${target}" is not a valid Function!`);
  process.exit(1);
}

runner()
  .then(() => {
    logger.success('Execution complete');
    process.exit();
  })
  .catch(error => {
    logger.fatal(error.stack);
    process.exit(1);
  });
