import localize from './lib/localize';
import ajax from './lib/ajax';

class LocalesLoader {
  constructor({ lang, SSR, path, get, locales }) {
    this.locales = {};
    this.observers = {};
    if (locales) {
      this.locales = locales;
      return;
    }
    if (get) {
      get().then((json) => {
        this.locales[lang] = json;
        this.observers[lang].map(observer => observer(json));
      }).catch((error) => {
        console.error(error);
      });
      return;
    }
    if (SSR) {
      const json = require(path);
      this.locales[lang] = json;
      this.observers[lang].map(observer => observer(json));
      return;
    }
    ajax({ path }).promise.then((json) => {
      this.locales[lang] = json;
      this.observers[lang].map(observer => observer(json));
    }).catch((error) => {
      console.error(error);
    });
  }
  subscribe(lang, observer) {
    if (this.locales[lang]) {
      observer(this.locales[lang]);
      return;
    }
    this.observers[lang] = (this.observers[lang] || []);
    this.observers[lang].push(observer);
  }
}

export default {
  install: (Vue, { lang, SSR, path, get, locales }) => {
    const localesLoader = new LocalesLoader({ lang, SSR, path, get, locales });
    Vue.mixin({
      data: () => ({
        lang,
        locales: {},
      }),
      created() {
        localesLoader.subscribe(lang, (localesJson) => {
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
