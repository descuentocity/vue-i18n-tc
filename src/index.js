import localize from './lib/localize';
import ajax from './lib/ajax';

class LocalesLoader {
  constructor({ lang, SSR, path }) {
    this.locales = {};
    this.observers = {};
    if (SSR) {
      const json = require(path);
      this.locales[lang] = json;
      this.observers[lang].map(observer => observer(json));
    } else {
      console.log('get', path);
      ajax({ path }).promise.then((json) => {
        this.locales[lang] = json;
        this.observers[lang].map(observer => observer(json));
      }).catch((error) => {
        console.error(error);
      });
    }
  }
  subscribe(lang, observer) {
    console.log(lang);
    if (this.locales[lang]) {
      observer(this.locales[lang]);
      return;
    }
    this.observers[lang] = (this.observers[lang] || []);
    this.observers[lang].push(observer);
  }
}

module.exports = {
  install: (Vue, { lang, SSR, path }) => {
    const localesLoader = new LocalesLoader({ lang, SSR, path });
    Vue.mixin({
      data: () => ({
        lang,
        locales: {},
      }),
      created() {
        localesLoader.subscribe(lang, (locales) => {
          this.locales = locales;
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
