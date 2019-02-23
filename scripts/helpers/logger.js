const { terminal } = require('./terminal');

const trimMultiline = (str = '') => {
  const lines = str.split('\n').map(line => line.trim());
  return lines.join('\n');
};

const COLOUR_BEGIN = 'magenta';
const COLOUR_SUCCESS = 'green';
const COLOUR_ERROR = 'brightRed';
const COLOUR_FATAL_ERROR = 'red';
const COLOUR_ALERT = 'yellow';
const COLOUR_ALT = 'gray';
const COLOUR_INFO = 'cyan';
const COLOUR_HIGHLIGHT = 'blue';

const logger = {
  begin(message) {
    terminal.print('BEGIN: ', COLOUR_BEGIN);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  success(message) {
    terminal.print('SUCCESS: ', COLOUR_SUCCESS);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  fatal(message) {
    terminal.print('FATAL ERROR: ', COLOUR_FATAL_ERROR);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  title(title) {
    terminal.print(`${trimMultiline(title)}\n\n`, 'brightMagenta');
  },
  error(message) {
    terminal.print('ERROR: ', COLOUR_ERROR);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  question(message) {
    terminal.print(`${trimMultiline(message)} `, COLOUR_ALERT);
  },
  dataRow(title, value, indent = ' ', separator = ':') {
    terminal.print(`${indent}${title}${separator} `);
    terminal.print(`${value}\n`, COLOUR_ALT);
  },
  warning(message) {
    terminal.print('WARNING: ', COLOUR_ALT);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  skipping(message) {
    terminal.print('SKIPPING: ', COLOUR_ALT);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  info(message) {
    terminal.print('INFO: ', COLOUR_INFO);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  run(cmd, message) {
    terminal.print('RUN: ', COLOUR_HIGHLIGHT);
    terminal.print(`${cmd} `);
    terminal.print(`${trimMultiline(message)}\n`);
  },
  sleep(seconds, message) {
    terminal.print('SLEEPING: ', COLOUR_HIGHLIGHT);
    terminal.print(`${trimMultiline(message)}\n`);

    return new Promise(r => setTimeout(r, seconds * 1000));
  },
  empty(n = 1) {
    if (!Number.isFinite(n)) {
      throw new Error('logger.empty(n): n is not a valid number');
    } else if (n > 0) {
      const str = (new Array(n + 1)).join('\n');
      terminal.print(str);
    }
  },
  confirm(message, autoConfirm = false) {
    this.question(message);
    return terminal.confirm(autoConfirm);
  },
  textInput(message, defaultValue = '') {
    this.question(message);
    return terminal.textInput(message, defaultValue);
  },
  passwordInput(message, defaultValue = '') {
    this.question(message);
    return terminal.passwordInput(message, defaultValue);
  },
};

module.exports = { logger };
