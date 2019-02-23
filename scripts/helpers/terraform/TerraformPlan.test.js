const path = require('path');
const shell = require('shelljs');

const { logger } = require('../logger');
const { PATH_TERRAFORM } = require('../../config');
const TerraformPlan = require('./TerraformPlan');

const mockPathToBin = '/path/to/terrabin';

describe('helpers/terraform/TerraformPlan.js tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(logger, 'fatal');
    sandbox.stub(process, 'exit');
    sandbox.stub(shell, 'which').returns(mockPathToBin);
    sandbox.stub(shell, 'exec').returns({ code: 0 });
  });

  afterEach(() => sandbox.restore());

  describe('a valid terraform plan', () => {
    let vars, plan;

    beforeEach(() => {
      vars = { a: 1, b: false };
      plan = new TerraformPlan('service', vars);
    });

    it('constructor() should bind properties correctly', () => {
      expect(plan.name).eq('service');
      expect(plan.path).eq(path.resolve(PATH_TERRAFORM, 'service'));
      expect(plan.variables).eq(vars);
      expect(plan.terraform).eq(mockPathToBin);
    });

    it('constructor() should call init', () => {
      const [[cmd, opts]] = shell.exec.args;
      expect(cmd).eq(`${plan.bin} init`);
      expect(opts).deep.eq({
        cwd: plan.path,
        silent: true,
      });
    });

    it('should produce a valid bin path with ENV variables', () => {
      expect(plan.bin).eq(`TF_VAR_a="1" TF_VAR_b="false" ${mockPathToBin}`);
    });

    it('`validate()` should exec terraform correctly', () => {
      shell.exec.resetHistory();
      plan.validate();

      const [[cmd, opts]] = shell.exec.args;
      expect(shell.exec.callCount).eq(1);
      expect(cmd).eq(`${plan.bin} validate`);
      expect(opts).deep.eq({ cwd: plan.path });
    });

    it('`plan()` should exec terraform correctly', () => {
      shell.exec.resetHistory();
      plan.plan();

      const [[cmd, opts]] = shell.exec.args;
      expect(shell.exec.callCount).eq(1);
      expect(cmd).eq(`${plan.bin} plan`);
      expect(opts).deep.eq({ cwd: plan.path });
    });

    it('`destroy(autoConfirm = false)`');
    it('`destroy(autoConfirm = true)`');
    it('`apply(autoConfirm = false)`');
    it('`apply(autoConfirm = true)`');
  });

  describe('invalid plans', () => {
    let plan;
    beforeEach(() => {
      plan = new TerraformPlan(`na-${Date.now()}`);
    });

    it('should trigger logging with correct prefix', () => {
      expect(logger.fatal.callCount).eq(1);
      expect(logger.fatal.args[0][0].indexOf(plan.logPrefix)).eq(0);
    });

    it('should exit with 1', () => {
      expect(process.exit.args[0][0]).eq(1);
    });
  });
});
