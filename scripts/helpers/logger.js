'use strict';

const terminal = require('./terminal');

const trimMultiline = (str = '') => {
    const lines = str.split('\n').map(line => line.trim());
    const nonEmptyLines = lines.filter(l => l.trim() !== '');
    const terminator = nonEmptyLines.length > 1 ? '\n' : '';

    return lines.join('\n') + terminator;
};

const logger = {
    fatal(message) {
        terminal.red('FATAL ERROR: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    title(title) {
        terminal.brightMagenta(`${trimMultiline(title)}\n\n`);
    },
    begin(message) {
        terminal.magenta('BEGIN: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    error(message) {
        terminal.brightRed('ERROR: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    question(message) {
        terminal.yellow(trimMultiline(message) + ' ');
    },
    confirm(message, autoConfirm = false) {
        logger.question(message);
        return terminal.confirm(autoConfirm);
    },
    textInput(message, defaultValue = '') {
        logger.question(message);
        return terminal.textInput(message, defaultValue);
    },
    passwordInput(message, defaultValue = '') {
        logger.question(message);
        return terminal.passwordInput(message, defaultValue);
    },
    dataRow(title, value, indent = ' ', separator = ':') {
        terminal.white(`${indent}${title}${separator} `);
        terminal.gray(`${value}\n`);
    },
    warning(message) {
        terminal.gray('WARNING: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    skipping(message) {
        terminal.gray('SKIPPING: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    info(message) {
        terminal.cyan('INFO: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    run(cmd, message) {
        terminal.blue('RUN: ');
        terminal.bold(cmd);
        terminal.blue(` ${trimMultiline(message)}\n`);
    },
    success(message) {
        terminal.green('SUCCESS: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    sleep(seconds, message) {
        terminal.blue('SLEEPING: ');
        terminal.bold(trimMultiline(message) + '\n');

        return new Promise(r => setTimeout(r, seconds * 1000));
    },
    empty(n = 1) {
        let str = '';
        while(!isNaN(n) && n-- > 0) str += '\n';

        str && terminal(str);
    },
}

module.exports = logger;