const path = require('path');

const {
  findRunners,
  describeRunnersHelp,
} = require('../../../scripts/helpers/runner');

const mockPath = `${__dirname}/../../mocks/runners/`;
const buildPath = (...args) => path.resolve.apply(null, [mockPath, ...args]);
const runners = findRunners(mockPath);

describe('helpers/runner.js test', () => {
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
