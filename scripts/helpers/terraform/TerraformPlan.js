'use strict';

const path = require('path');
const shell = require('shelljs');

const terminal = require('../terminal');
const logger = require('../logger');
const { PATH_TERRAFORM } = require('../../config');

const terraform = shell.which('terraform');
if(!terraform) {
  logger.fatal('"terraform" binary was not found');
  logger.info('Download terraform from https://www.terraform.io/downloads.html');
  process.exit();
}

class TerraformPlan {
  constructor(name, variables = {}) {
    this.name = name.replace('.', '');
    this.path = path.resolve(PATH_TERRAFORM, this.name);
    this.variables = variables;

    if(!this.init()) {
      const error = `${this.logPrefix} "${this.path}" is not a valid plan`;
      logger.fatal(error);
      process.exit(1);
    }
  }

  get logPrefix() {
    return `Terraform (${this.name}):`;
  }

  get options() {
    return {
      cwd: this.path,
    };
  }

  get bin() {
    const variables = Object.keys(this.variables).map(
      key => `TF_VAR_${key}="${this.variables[key]}"`
    );

    return `${variables.join(' ')} ${terraform}`;
  }

  get output() {
    const json = this.exec('output -json', { silent: true });
    const data = JSON.parse(json);

    return Object.keys(data).reduce((obj, key) => ({
      ...obj,
      [key]: data[key].value
    }), {});
  }

  exec(cmd, options) {
    return shell.exec(`${this.bin} ${cmd}`, {
      ...options,
      ...this.options,
    });
  }

  init() {
    if(!shell.test('-d', this.path)) {
      return false;
    }

    return this.exec('init', { silent: true }).code === 0;
  }

  validate() {
    return this.exec('validate').code === 0;
  }

  plan() {
    return this.exec('plan').code === 0;
  }

  async apply(autoConfirm = false) {
    if(!this.validate()) {
      return false;
    }

    let confirm = autoConfirm;
    const cmd = 'apply -auto-approve';

    logger.warning(`${this.logPrefix} Applying with variables:\n`);
    Object.keys(this.variables).forEach(key =>
      logger.dataRow(key, this.variables[key])
    );
    terminal('\n');

    if(!confirm) {
      logger.question(`${this.logPrefix} Are you sure that you want to apply the plan?`);
      confirm = await terminal.confirm();
    }

    return confirm ? this.exec(cmd).code === 0 : false;
  }
}

module.exports = TerraformPlan;