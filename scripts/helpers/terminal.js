const { terminal } = require('terminal-kit');

const terminate = () => {
  terminal.grabInput(false);
  terminal.bold('\n\nAborting...\n');
  setTimeout(process.exit, 500);
};

terminal.on('key', name => (name === 'CTRL_C' ? terminate() : {}));
terminal.confirm = async (defautlYes = false) => {
  const options = {
    yes: ['Y', 'y'],
    no: ['N', 'n'],
  };

  const enterTarget = defautlYes ? options.yes : options.no;
  enterTarget.push('ENTER');

  const text = defautlYes ? '[Y|n]: ' : '[y|N]: ';
  terminal.bold(text);

  const result = await terminal.yesOrNo(options).promise;
  terminal(`${result ? 'yes' : 'no'}\n\n`);

  return result;
};

terminal.textInput = async (defaultValue, echoChar = false) => {
  const value = await terminal.inputField({
    echoChar,
    cancelable: true,
    default: defaultValue || '',
  }).promise;

  terminal('\n');
  return value;
};

terminal.passwordInput = defaultValue => terminal.textInput(defaultValue, true);

terminal.select = async (options) => {
  const value = await terminal.singleColumnMenu(options, {
    cancelable: true,
    leftPadding: '    ',
    selectedLeftPadding: '  * ',
  }).promise;
  terminal('\n');

  return value;
};

module.exports = terminal;
