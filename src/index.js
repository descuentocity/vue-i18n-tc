import localize from './lib/localize';

let LOCALES = {};

export default {
  install: (Vue) => {
    Vue.mixin({
      methods: {
        __(...args) {
          return localize(LOCALES, ...args);
        },
        setLocales(_locales) {
          LOCALES = _locales;
        },
      },
    });
  },
};
