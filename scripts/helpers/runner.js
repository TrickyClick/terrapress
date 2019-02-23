const fs = require('fs');
const path = require('path');

const { PATH_SCRIPTS } = require('../config');

const runnerRegex = /\.run\.js$/;
const sepRegex = path.sep === '/' ? /\//g : /\\/g;
const rootPath = path.sep === '/' ? /^\//i : /^[a-z]{1}:\\/g;

const pathToCommand = (filepath, root = '') => path.resolve(filepath)
  .replace(path.resolve(root), '')
  .replace(path.resolve(root), '')
  .replace(`${PATH_SCRIPTS}${path.sep}`, '')
  .replace(runnerRegex, '')
  .replace(rootPath, '')
  .replace(sepRegex, ':');

const findRunnerScripts = dir => fs.readdirSync(dir)
  .reduce((aggregator, file) => {
    const fullpath = path.resolve(dir, file);
    const stats = fs.lstatSync(fullpath);

    let result = fullpath;
    if (stats.isDirectory() && !stats.isSymbolicLink()) {
      result = findRunnerScripts(fullpath);
    }

    return aggregator.concat(result);
  }, [])
  .filter(filepath => runnerRegex.test(filepath));

const findRunners = (dir = PATH_SCRIPTS) => {
  const scripts = findRunnerScripts(dir);
  return scripts.reduce((aggregator, filepath) => ({
    ...aggregator,
    [pathToCommand(filepath, dir)]: filepath,
  }), {});
};

const describeRunnersHelp = runners => Object.keys(runners).map(key => ({
  cmd: key,
  help: require(runners[key]).help,
}))
  .sort((a, b) => {
    const aCmds = a.cmd.split(':');
    const bCmds = b.cmd.split(':');

    for (let i = 0; i < aCmds.length; i++) {
      if (aCmds[i] !== bCmds[i]) {
        if (!bCmds[i]) {
          return 1;
        }

        return aCmds[i] > bCmds[i] ? 1 : -1;
      }
    }

    return 0;
  });

module.exports = {
  findRunners,
  describeRunnersHelp,
};
