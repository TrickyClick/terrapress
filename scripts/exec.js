'use strict';

const logger = require('./helpers/logger');
const { findRunners, describeRunnersHelp } = require('./helpers/runner');

const cmd = process.argv[process.argv.length -1];
const runners = findRunners();

if(!runners[cmd]) {
  if(cmd !== __filename && cmd !== 'help') {
    logger.fatal(`Unrecognised command "${cmd}"`);
  }

  logger.run('npm run exec <command>', 'to execute a script');
  logger.info('Available commands:\n');

  const info = describeRunnersHelp(runners);
  info.forEach(({ cmd, help }) =>
    logger.dataRow(cmd, help, '\t', ' -')
  );

  logger.empty(1);
  process.exit();
}

const { run } = require(runners[cmd]);

if(typeof run !== 'function') {
  logger.fatal(`Exec: Runner in "${runners[cmd]}" is not a valid Function!`);
  process.exit(1);
}

run()
  .then(() => {
    logger.success(`${cmd} finished`);
    process.exit();
  })
  .catch(error => {
    logger.fatal(error.stack);
    process.exit(1);
  });
