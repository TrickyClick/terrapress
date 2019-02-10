'use strict';

const { terminal } = require('terminal-kit');

const trimMultiline = str => str.split('\n')
  .map(line => line.trim())
  .join('\n');

const terminate = () => {
  terminal.grabInput(false) ;
  terminal('\n');
  process.exit();
}

terminal.on('key', name => name === 'CTRL_C' ? terminate() : {});
terminal.confirm = async (defautlYes = false) => {
  const options = {
    yes: ['Y', 'y'],
    no: ['N', 'n']
  };

  const enterTarget = defautlYes ? options.yes : options.no;
  enterTarget.push('ENTER');

  const text = defautlYes ? ' [Y|n]: ' : ' [y|N]: ';
  terminal.bold(text);

  const result = await terminal.yesOrNo(options).promise;
  terminal('\n\n');

  return result;
}

terminal.fatal = message => {
  terminal.brightRed('Fatal Еrror: ');
  terminal.bold(`${trimMultiline(message)}\n`);
}

terminal.warning = message => {
  terminal.yellow('Warning: ');
  terminal.bold(`${trimMultiline(message)}\n`);
}

terminal.info = message => {
  terminal.cyan('INFO: ');
  terminal.bold(`${trimMultiline(message)}\n`)
}

module.exports = terminal;