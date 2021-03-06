const path = require('path');

const { PATH_TEST_MOCKS } = require('../config');
const { replaceLinks, randomString, renderTemplate } = require('./strings');

describe('scripts/helpers/strings.test', () => {
  describe('replaceLinks(text, originDomain, replaceWith)', () => {
    const originDomain = 'origin.com';
    const replace = 'http://0.0.0.0:8000';
    const testText = `https://${originDomain}\n\n\nhttp://${originDomain}`;
    const expectation = `${replace}\n\n\n${replace}`;

    it('should replace origin unencoded domain correctly', () => {
      const replaced = replaceLinks(testText, originDomain, replace);
      expect(replaced).eq(expectation);
    });

    it('should replace origin encoded domain correctly', () => {
      const testTextEncoded = testText.split('\n').map(encodeURIComponent).join('\n');
      const expectationEncoded = expectation.split('\n').map(encodeURIComponent).join('\n');
      const replaced = replaceLinks(testTextEncoded, originDomain, replace);

      expect(replaced).eq(expectationEncoded);
    });
  });
  describe('randomString(len)', () => {
    it('should generate random strings with correct length', () => {
      const keys = [];
      for (let i = 0; i < 20; i++) {
        const key = randomString(20);

        expect(key.length).eq(20);
        expect(keys.indexOf(key)).eq(-1);
      }
    });
  });

  describe('renderTemplate(template, variables)', () => {
    const templatePath = path.resolve(PATH_TEST_MOCKS, 'string.template.txt');

    it('renders a template with variables from path', () => {
      const variables = {
        name: 'Andriyan',
        location: 'New York',
      };

      const template = renderTemplate(templatePath, variables);
      expect(template).eq('Hello Andriyan, you are in\nNew York\nWelcome Andriyan!');
    });

    it('renders a template without variables from path', () => {
      const template = renderTemplate(templatePath);
      expect(template).eq('Hello %name%, you are in\n%location%\nWelcome %name%!');
    });
  });
});
