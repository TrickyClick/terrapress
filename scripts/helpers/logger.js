const chalk = require('chalk');

const validColors = {
    black: true,
    red: true,
    green: true,
    yellow: true,
    blue: true,
    magenta: true,
    cyan: true,
    white: true,
    gray: true,
    redBright: true,
    greenBright: true,
    yellowBright: true,
    blueBright: true,
    magentaBright: true,
    cyanBright: true,
    whiteBright: true,
}

const getColor = color => {
    if(!validColors[color]) {
        throw new Error(`getColor("${color}") is not a valid chalk color. Valid colors are: ${validColors.join(', ')}`);
    }

    return chalk[color];
}

const colored = (color, prefix) => (message) =>
    console.log(getColor(color)(prefix), message);

const coloredBold = (color, prefix) => (message) =>
    console.log(chalk.bold(getColor(color)(prefix)), message);

const coloredAllBold = (color, prefix) => (message) =>
    console.log(chalk.bold(getColor(color)(prefix)), chalk.bold(message));

module.exports = {
  colored,
  coloredBold,
  coloredAllBold,
}