const { loggerFactory } = require('../../../scripts/helpers/logger');

const testMsg = '\nsome\n      test\n   msg\n\n\n';
const testMsgTrimmed = '\nsome\ntest\nmsg\n\n\n';

describe('helpers/logger.js test', () => {
  let terminal;
  let logger;
  let print;

  beforeEach(() => {
    print = sinon.stub();
    terminal = {
      blue: print,
      bold: print,
      brightMagenta: print,
      brightRed: print,
      cyan: print,
      green: print,
      red: print,
      magenta: print,
      yellow: print,
      white: print,
      gray: print,
      confirm: sinon.stub(),
      textInput: sinon.stub(),
      passwordInput: sinon.stub(),
    };

    logger = loggerFactory(terminal);
  });

  describe('Simple message formatters', () => {
    it('logger.fatal(message) prints a FATA ERROR prefixed message', () => {
      logger.fatal(testMsg);

      const [[prefix], [message]] = print.args;
      expect(prefix).eq('FATAL ERROR: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.title(title) renders a message with an extra new line', () => {
      logger.title(testMsg);

      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed}\n\n`);
    });

    it('logger.begin(message) renders a BEGIN prefixed message', () => {
      logger.begin(testMsg);

      const [[prefix], [message]] = print.args;
      expect(prefix).eq('BEGIN: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.error(message) renders a ERROR prefixed message', () => {
      logger.error(testMsg);

      const [[prefix], [message]] = print.args;
      expect(prefix).eq('ERROR: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.warning(message) renders a WARNING prefixed message', () => {
      logger.warning(testMsg);

      const [[prefix], [message]] = print.args;
      expect(prefix).eq('WARNING: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.skipping(message) renders a SKIPPING prefixed message', () => {
      logger.skipping(testMsg);

      const [[prefix], [message]] = print.args;
      expect(prefix).eq('SKIPPING: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.info(message) renders a INFO prefixed message', () => {
      logger.info(testMsg);

      const [[prefix], [message]] = print.args;
      expect(prefix).eq('INFO: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.success(message) renders a SUCCESS prefixed message', () => {
      logger.success(testMsg);

      const [[prefix], [message]] = print.args;
      expect(prefix).eq('SUCCESS: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.run(cmd, message) renders a RUN prefixed message', () => {
      logger.run('test cmd', testMsg);

      const [[prefix], [cmd], [message]] = print.args;
      expect(prefix).eq('RUN: ');
      expect(cmd).eq('test cmd ');
      expect(message).eq(`${testMsgTrimmed}\n`);
    });

    it('logger.empty(n) renders n > 0 amount of break line characters', () => {
      logger.empty(5);
      logger.empty(1);
      logger.empty(3);
      logger.empty(-1);
      logger.empty(0);

      const [[first], [second], [third]] = print.args;

      expect(print.callCount).eq(3);
      expect(first).eq('\n\n\n\n\n');
      expect(second).eq('\n');
      expect(third).eq('\n\n\n');
    });

    it('logger.querstion(message) renders text with spacing, no breakline', () => {
      logger.question(testMsg);

      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);
    });
  });

  describe('logger.confirm(message, autoConfirm = false)', () => {
    it('should render a confirmation dialog', () => {
      logger.confirm(testMsg);
      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);

      const [[autoConfirm]] = terminal.confirm.args;
      expect(autoConfirm).eq(false);
    });

    it('should render with supplied autoConfirm', () => {
      logger.confirm(testMsg, true);
      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);

      const [[autoConfirm]] = terminal.confirm.args;
      expect(autoConfirm).eq(true);
    });
  });

  describe('logger.textInput(message, defaultValue = "")', () => {
    it('should render a textInput dialog', () => {
      logger.textInput(testMsg);

      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);

      const [[msg, defaultText]] = terminal.textInput.args;
      expect(msg).eq(testMsg);
      expect(defaultText).eq('');
    });

    it('should render with supplied defaultValue', () => {
      logger.textInput(testMsg, 'de$fault');

      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);

      const [[msg, defaultText]] = terminal.textInput.args;
      expect(msg).eq(testMsg);
      expect(defaultText).eq('de$fault');
    });
  });

  describe('logger.passwordInput(message, defaultValue = "")', () => {
    it('should render a passwordInput dialog', () => {
      logger.passwordInput(testMsg);
      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);

      const [[msg, defaultText]] = terminal.passwordInput.args;
      expect(msg).eq(testMsg);
      expect(defaultText).eq('');
    });
  });

  describe('logger.passwordInput(message, defaultValue = "")', () => {
    it('should render correctly a passInput dialog', () => {
      logger.passwordInput(testMsg);

      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);

      const [[passMsg, defaultPass]] = terminal.passwordInput.args;
      expect(passMsg).eq(testMsg);
      expect(defaultPass).eq('');
    });

    it('should render correctly with supplied default value', () => {
      logger.passwordInput(testMsg, 'pass$$');

      const [[message]] = print.args;
      expect(message).eq(`${testMsgTrimmed} `);

      const [[passMsg, defaultPass]] = terminal.passwordInput.args;
      expect(passMsg).eq(testMsg);
      expect(defaultPass).eq('pass$$');
    });
  });

  describe('logger.dataRow(title, value, indent = " ", separator = ":")', () => {
    it('should render a formatted data message', () => {
      logger.dataRow('prefix', 'suffix');

      const [[prefix], [value]] = print.args;
      expect(prefix).eq(' prefix: ');
      expect(value).eq('suffix\n');
    });

    it('should render correctly with custom params', () => {
      logger.dataRow('prefix', 'suffix', ' -> ', ' ___');

      const [[prefix], [value]] = print.args;
      expect(prefix).eq(' -> prefix ___ ');
      expect(value).eq('suffix\n');
    });
  });

  describe('logger.sleep(seconds, message)', () => {
    let sandbox;
    let timer;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      timer = sandbox.useFakeTimers();
    });

    afterEach(() => {
      sandbox.restore();
      timer.restore();
    });

    it('should return a promise that resolves in X seconds', () => {
      const sleep = logger.sleep(20, testMsg);

      const [[prefix], [message]] = print.args;

      expect(prefix).eq('SLEEPING: ');
      expect(message).eq(`${testMsgTrimmed}\n`);
      expect(sleep instanceof Promise).true;

      timer.tick(20000);
      return sleep.then(res => expect(res).undefined);
    });
  });
});
