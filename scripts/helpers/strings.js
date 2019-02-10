const replaceLinks = (text, originDomain, replaceWith) => {
  const regexDomain = originDomain.replace('.', '\\.');
  const rawRegex = new RegExp(`http(s)?:\/\/${regexDomain}`, 'gi');
  const encodedRegex = new RegExp(`http(s)?${encodeURIComponent('://')}${regexDomain}`, 'gi');

  return text.replace(rawRegex, replaceWith).replace(encodedRegex, replaceWith);
};

module.exports = {
  replaceLinks
};