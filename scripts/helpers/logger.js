'use strict';

const terminal = require('./terminal');

const trimMultiline = str => {
    const lines = str.split('\n').map(line => line.trim());
    const len = lines.length;
    const terminator = len > 1 ? '\n' : '';

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

    error(message) {
        terminal.brightRed('ERROR: ');
        terminal.bold(trimMultiline(message) + '\n');
    },
    question(message) {
        terminal.yellow(trimMultiline(message) + ' ');
    },
    dataRow(title, value) {
        terminal.white(`\t${title}: `);
        terminal.gray(`${value}\n`);
    },
    warning(message) {
        terminal.gray('WARNING: ');
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
    }
}

module.exports = logger;