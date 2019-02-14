const pkg = require('../package.json');
const logger = require('./helpers/logger');
const initApp = require('./init/app.run');
const initSecrets = require('./init/secrets.run');

const init = async () => {
  logger.info(
    `Welcome to ultimate-wordpress's configurator script
    Please follow the instructions`,
  );

  await initApp.run();
  await initSecrets.run();

  logger.success('Terrapress initialisation complete!');
  logger.run('npm run exec deploy', 'to setup the infrastrcture and deploy the server');
  logger.run('npm run exed local:setup', 'to setup for local dev');
};

module.exports = {
  run: init,
  help: `Inits ${pkg.name}. Configures app.json and secrets.json`,
};
