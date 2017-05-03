/* global process */
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

export default {
  moduleName: 'vue-i18n-tc',
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'cjs',
  // sourceMap: true,
  plugins: [
    // resolve({browser: true}),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    json(),
    buble({ include: 'src/**' }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
  external,
};
