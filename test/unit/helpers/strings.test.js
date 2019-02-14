describe('helpers/strings.js test', () => {
  describe('replaceLinks(text, originDomain, replaceWith)', () => {
    it('should replace origin unencoded domain correctly');
    it('should replace origin encoded domain correctly');
  });
  describe('randomString(len)', () => {
    it('calls crypto.randomBytes correctly');
    it('should generate random strings');
    it('should limit the length of the random strings generated');
  });
  describe('replaceVariables(template, variables)', () => {
    it('returns the template, if there are no variables');
    it('replace variables correctly');
  });
  describe('renderTemplate(template, variables)', () => {
    it('renders a template with variables from path');
  });
});
