'use strict';

const path = require('path');
const shell = require('shelljs');

const terminal = require('../terminal');
const logger = require('../logger');
const { PATH_TERRAFORM } = require('../../config');

const ESCAPE_SEQUENCE = /\x1b\[[0-9;]*[a-zA-Z]/g;

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
    if(!shell.test('-d', this.path)) {
      return false;
    }

    return this.exec('init', { silent: true }).code === 0;
  }

  validate() {
    const isValid = this.exec('validate').code === 0;
    if(!isValid) {
    }

    return isValid;
  }

  plan() {
    return this.exec('plan').code === 0;
  }

  log(message) {
    return `${this.logPrefix} ${message}`;
  }

  async destroy(autoConfirm = false) {
    if(!this.hasResources) {
      logger.warning(this.log('No resources. Aborting destroy.'));
      return false;
    }

    if(!this.validate()) {
      logger.warning(this.log(`Plan is invalid. Aborting destroy.`));
      return false;
    }

    logger.info(this.log(`Destroying infrastructure`));

    let confirm = autoConfirm;
    if(!confirm) {
      logger.question(this.log(`Are you sure that you want to destroy the plan?`));
      confirm = await terminal.confirm();
    }

    if(confirm) {
      const destroy = this.exec('destroy -auto-approve');
      if(destroy.code === 0) {
        logger.success(this.log('Infrastructure destroyed.'));
        return true;
      } else {
        logger.error(this.log('Failed to destroy infrastructure.'));
        return false;
      }
    }

    return false;
  }

  async apply(confirm = false) {
    if(!this.validate()) {
      logger.warning(this.log('Plan is invalid. Aborting apply.'));
      return false;
    }

    logger.warning(this.log('Applying with variables:\n'));
    for(let key in this.variables) {
      logger.dataRow(key, this.variables[key]);
    }
    
    terminal('\n');

    if(!confirm) {
      logger.question(this.log('Are you sure that you want to apply the plan?'));
      confirm = await terminal.confirm();
    }

    return confirm ? this.exec('apply -auto-approve').code === 0 : false;
  }
}

module.exports = TerraformPlan;