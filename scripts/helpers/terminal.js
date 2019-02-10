'use strict';

const { terminal } = require('terminal-kit');

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
  terminal.red('FATAL ERROR: ');
  terminal.bold(trimMultiline(message) + '\n');
}

terminal.title = message => {
  terminal.brightMagenta(`${trimMultiline(message)}\n\n`);
}

terminal.err = message => {
  terminal.brightRed('ERROR: ');
  terminal.bold(trimMultiline(message) + '\n');
}

terminal.question = message => {
  terminal.yellow(trimMultiline(message) + ' ');
}

terminal.dataRow = (title, value) => {
  terminal.white(`\t${title}: `);
  terminal.gray(`${value}\n`);
}

terminal.warning = message => {
  terminal.gray('WARNING: ');
  terminal.bold(trimMultiline(message) + '\n');
}

terminal.info = message => {
  terminal.cyan('INFO: ');
  terminal.bold(trimMultiline(message) + '\n');
}

terminal.run = (cmd, message) => {
  terminal.blue('RUN: ');
  terminal.bold(cmd);
  terminal.blue(` ${trimMultiline(message)}\n`);
}

terminal.success = message => {
  terminal.green('SUCCESS: ');
  terminal.bold(trimMultiline(message) + '\n');
}

module.exports = terminal;