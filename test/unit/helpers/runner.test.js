const path = require('path');

const { findRunners } = require('../../../scripts/helpers/runner');

const mockPath = `${__dirname}/../../mocks/runners/`;
const buildPath = suffix => path.resolve(mockPath, suffix);

describe.only('helpers/runner.js test', () => {
  describe('findRunners(dir)', () => {
    it('should replace origin unencoded domain correctly', () => {
      const runners = findRunners(mockPath);
      expect(runners).deep.eq({
        one: buildPath('one.run.js'),
        'deep:two': buildPath(`deep${path.sep}two.run.js`),
      });
    });
  });
});
