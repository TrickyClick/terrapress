const path = require('path');

const { PATH_TEST_MOCKS } = require('../config');
const { findRunners, describeRunnersHelp } = require('./runner');

const mockPath = path.resolve(PATH_TEST_MOCKS, 'runners');
const buildPath = (...args) => path.resolve.apply(null, [mockPath, ...args]);
const runners = findRunners(mockPath);

describe('scripts/helpers/runner.test', () => {
  it('findRunners(dir) should replace origin unencoded domain correctly', () => {
    expect(runners).deep.eq({
      one: buildPath('one.run.js'),
      'deep:two': buildPath('deep', 'two.run.js'),
    });
  });

  it('describeRunnersHelp(runners) should load data from the source', () => {
    const result = describeRunnersHelp(runners);
    expect(result).deep.eq(
      [
        { cmd: 'deep:two', help: 'Deep two' },
        { cmd: 'one', help: 'Shallow one' },
      ],
    );
  });
});
