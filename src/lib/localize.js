import getLocale from './getLocale';
import interpolateArray from './interpolateArray';
import interpolateObject from './interpolateObject';
import pluralization from './pluralization';

// __('simple string');
// __('pluralization', 2);
// __('interpolation {args1} {args2}', {arg1: 1, arg2: 2});
// __('interpolation and pluralization {args1} {args2}', {arg1: 1, arg2: 2}, 3);
// __('array interpolation ?, ?', [1, 2]);
// __('array interpolation and pluralization ? ?', [1, 2], 3);
export default function localize(locales, key, params, qty) {
  try {
    let locale = getLocale(locales, key);
    if (qty) {
      locale = pluralization(locale, qty);
    } else if (typeof params === 'number') {
      locale = pluralization(locale, params /* params is qty */);
    }
    if (Array.isArray(params)) {
      return interpolateArray(locale, params);
    }
    if (typeof params === 'object') {
      return interpolateObject(locale, params);
    }
    return locale;
  } catch (e) {
    console.error(e);
    // SI HAY ALGUN ERROR QUE DEVUELVA LA KEY
    return key;
  }
}
