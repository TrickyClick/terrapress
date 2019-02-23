const path = require('path');
const shell = require('shelljs');

const { logger } = require('../logger');
const { PATH_TERRAFORM } = require('../../config');

const ESCAPE_SEQUENCE = /\x1b\[[0-9;]*[a-zA-Z]/g;

class TerraformPlan {
  constructor(name, variables = {}) {
    this.terraform = shell.which('terraform');
    if (!this.terraform) {
      logger.fatal('"terraform" binary was not found');
      logger.info('Download terraform from https://www.terraform.io/downloads.html');
      process.exit();
    }

    this.name = name.replace('.', '');
    this.path = path.resolve(PATH_TERRAFORM, this.name);
    this.variables = variables;

    if (!this.init()) {
      const error = this.log(`"${this.path}" is not a valid plan`);
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
      key => `TF_VAR_${key}="${this.variables[key]}"`,
    );

    variables.push('');
    return `${variables.join(' ')}${this.terraform}`;
  }

  get output() {
    const json = this.exec('output -json', { silent: true });
    const data = JSON.parse(json);

    return Object.keys(data).reduce((obj, key) => ({
      ...obj,
      [key]: data[key].value,
    }), {});
  }

  get hasResources() {
    const show = this.exec('show', { silent: true });
    const outputNoColours = show.replace(ESCAPE_SEQUENCE, '');

    return outputNoColours.trim() !== '';
  }

  exec(cmd, options) {
    return shell.exec(`${this.bin} ${cmd}`, {
      ...options,
      ...this.options,
    });
  }

  init() {
    if (!shell.test('-d', this.path)) {
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

  log(message) {
    return `${this.logPrefix} ${message}`;
  }

  async destroy(autoConfirm = false) {
    if (!this.hasResources) {
      logger.warning(this.log('No resources. Aborting destroy.'));
      return false;
    }

    if (!this.validate()) {
      logger.warning(this.log('Plan is invalid. Aborting destroy.'));
      return false;
    }

    logger.info(this.log('Destroying infrastructure'));

    let confirm = autoConfirm;
    if (!confirm) {
      const message = this.log('Are you sure that you want to destroy the plan?');
      confirm = await logger.confirm(message);
    }

    if (confirm) {
      const destroy = this.exec('destroy -auto-approve');
      if (destroy.code === 0) {
        logger.success(this.log('Infrastructure destroyed.'));
        return true;
      }
      logger.error(this.log('Failed to destroy infrastructure.'));
      return false;
    }

    return false;
  }

  async apply(autoConfirm = false) {
    if (!this.validate()) {
      logger.warning(this.log('Plan is invalid. Aborting apply.'));
      return false;
    }

    logger.warning(this.log('Applying with variables:\n'));
    for (const key in this.variables) {
      logger.dataRow(key, this.variables[key]);
    }

    logger.empty(1);

    let confirm = autoConfirm;
    if (!confirm) {
      const message = this.log('Are you sure that you want to apply the plan?');
      confirm = await logger.confirm(message);
    }

    return confirm ? this.exec('apply -auto-approve').code === 0 : false;
  }
}

module.exports = TerraformPlan;
