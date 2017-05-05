import localize from './lib/localize';
import ajax from './lib/ajax';

function getLocales({ SSR, path, get }) {
  return new Promise((resolve) => {
    if (get) {
      get().then((json) => {
        resolve(json);
      }).catch((error) => {
        console.error(error);
        resolve({});
      });
      return;
    }
    if (SSR) {
      const json = require(path);
      resolve(json);
      return;
    }
    ajax({ path }).promise.then((json) => {
      resolve(json);
    }).catch((error) => {
      console.error(error);
      resolve({});
    });
  });
}

class LocalesLoader {
  constructor({ SSR, path, get, locales }) {
    this.locales = undefined;
    this.observers = [];
    getLocales({ SSR, path, get, locales }).then((localesJson) => {
      this.locales = localesJson;
      this.observers.map(observer => observer(localesJson));
    }).catch((error) => {
      console.error(error);
    });
  }
  subscribe(observer) {
    if (this.locales) {
      observer(this.locales);
      return;
    }
    this.observers = (this.observers || []);
    this.observers.push(observer);
  }
}

export default {
  install: (Vue, { lang, SSR, path, get, locales }) => {
    if ((SSR && locales) || locales) {
      Vue.mixin({
        data: () => ({
          lang,
          locales,
        }),
        methods: {
          __(...args) {
            return localize(this.locales, ...args);
          },
        },
      });
      return;
    }
    const localesLoader = new LocalesLoader({ lang, SSR, path, get });
    Vue.mixin({
      data: () => ({
        lang,
        locales: {},
      }),
      created() {
        localesLoader.subscribe((localesJson) => {
          this.locales = localesJson;
        });
      },
      methods: {
        __(...args) {
          return localize(this.locales, ...args);
        },
      },
    });
  },
};
