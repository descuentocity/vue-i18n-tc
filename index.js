/* eslint-disable global-require, import/no-dynamic-require, no-underscore-dangle */
export function getLocale(locales, key = '') {
  const locale = locales[key];
  if (locale) {
    return locale;
  }
  return key;
}

export function interpolateObject(key, params) {
  let str = key;
  key.match(/\{[\w]+\}/g).forEach((param) => {
    const interpolateKey = param.replace(/\{?\}?/g, '');
    const regex = new RegExp(param, 'g');
    str = str.replace(regex, params[interpolateKey]);
  });
  return str;
}

export function interpolateArray(key, params = []) {
  return params.map(param => key.replace(/\?/, param));
}

export function pluralization(locale, qty) {
  const local = locale.split('|');
  if (qty > 1 && local[1]) {
    return local[1];
  }
  return local[0];
}

// __('simple string');
// __('pluralization', 2);
// __('interpolation {args1} {args2}', {arg1: 1, arg2: 2});
// __('interpolation and pluralization {args1} {args2}', {arg1: 1, arg2: 2}, 3);
// __('array interpolation ?, ?', [1, 2]);
// __('array interpolation and pluralization ? ?', [1, 2], 3);
export function __(locales, key, params, qty) {
  try {
    let locale = getLocale(locales, key);
    if (qty) {
      locale = pluralization(locale, qty);
    } else if (typeof params === 'number') {
      locale = pluralization(locale, params /* params is qty */);
    }
    if (typeof params === 'object') {
      return interpolateObject(locale, params);
    }
    if (Array.isArray(params)) {
      return interpolateArray(locale, params);
    }
    return locale;
  } catch (e) {
    console.error(e);
    // SI HAY ALGUN ERROR QUE DEVUELVA LA KEY
    return key;
  }
}

const localesPaths = {
  'es-AR': cb => require(['json-loader!./locales/es-AR.json'], cb),
  'en-US': cb => require(['json-loader!./locales/en-US.json'], cb),
  'es-CL': cb => require(['json-loader!./locales/es-CL.json'], cb),
  'es-CO': cb => require(['json-loader!./locales/es-CO.json'], cb),
  'es-ES': cb => require(['json-loader!./locales/es-ES.json'], cb),
  'es-MX': cb => require(['json-loader!./locales/es-MX.json'], cb),
  'es-PE': cb => require(['json-loader!./locales/es-PE.json'], cb),
  'es-UY': cb => require(['json-loader!./locales/es-UY.json'], cb),
  'es-VE': cb => require(['json-loader!./locales/es-VE.json'], cb),
  'pt-BR': cb => require(['json-loader!./locales/pt-BR.json'], cb),
};


class LocalesLoader {
  constructor(lang) {
    this.locales = undefined;
    this.observers = [];
    localesPaths[lang]((json) => {
      this.locales = json;
      this.observers.map(observer => observer(json));
    });
  }
  subscribe(observer) {
    if (this.locales) {
      observer(this.locales);
      return;
    }
    this.observers.push(observer);
  }
}

export default {
  install: (Vue, { lang } = {}) => {
    const localesLoader = new LocalesLoader(lang);
    Vue.mixin({
      data: () => ({
        lang,
        locales: {},
      }),
      created() {
        localesLoader.subscribe((locales) => {
          this.locales = locales;
        });
      },
      methods: {
        __(...args) {
          return __(this.locales, ...args);
        },
      },
    });
  },
};
