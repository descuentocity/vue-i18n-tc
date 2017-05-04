export default function getLocale(locales, key = '') {
  const locale = locales[key];
  if (locale) {
    return locale;
  }
  return key;
}
