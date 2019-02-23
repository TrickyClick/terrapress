const { terminal } = require('terminal-kit');

const BREAK_KEY = 'CTRL_C';

const onKeyPress = (pressedKey) => {
  if (pressedKey === BREAK_KEY) {
    terminal.grabInput(false);
    terminal.print('\n\nAborting...\n');
    setTimeout(process.exit, 500);
  }
};

terminal.print = (message, method = 'bold') => terminal[method](message);
terminal.on('key', onKeyPress);

terminal.confirm = async (defautlYes = false) => {
  const options = {
    yes: ['Y', 'y'],
    no: ['N', 'n'],
  };

  const enterTarget = defautlYes ? options.yes : options.no;
  enterTarget.push('ENTER');

  const text = defautlYes ? '[Y|n]: ' : '[y|N]: ';
  terminal.print(text);

  const result = await terminal.yesOrNo(options).promise;
  terminal.print(`${result ? 'yes' : 'no'}\n\n`);

  return result;
};

terminal.textInput = async (defaultValue, echoChar = false) => {
  const value = await terminal.inputField({
    echoChar,
    cancelable: true,
    default: defaultValue || '',
  }).promise;

  terminal.print('\n');
  return value;
};

terminal.passwordInput = defaultValue => terminal.textInput(defaultValue, true);

terminal.select = async (options) => {
  const value = await terminal.singleColumnMenu(options, {
    cancelable: true,
    leftPadding: '    ',
    selectedLeftPadding: '  * ',
  }).promise;

  terminal.print('\n');
  return value;
};

module.exports = {
  terminal,
  onKeyPress,
};
