const { logger } = require('./helpers/logger');
const { findRunners, describeRunnersHelp } = require('./helpers/runner');

const [, , command] = process.argv;
const runners = findRunners();

if (!command || !runners[command]) {
  if (command && command !== 'help') {
    logger.fatal(`Unrecognised command "${command}"`);
  }

  logger.run('npm run exec <command>', 'to execute a script');
  logger.info('Available commands:\n');

  const info = describeRunnersHelp(runners);
  info.forEach(({ cmd, help }) => logger.dataRow(cmd, help, '\t', ' -'));

  logger.empty(1);
  process.exit();
}

const { run } = require(runners[command]);

if (typeof run !== 'function') {
  logger.fatal(`Exec: Runner in "${runners[command]}" is not a valid Function!`);
  process.exit(1);
}

run()
  .then(() => {
    logger.success(`${command} finished`);
    process.exit();
  })
  .catch((error) => {
    logger.fatal(error.stack);
    process.exit(1);
  });
