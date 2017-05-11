/* global describe, it */
const chai = require('chai');

chai.config.includeStack = true;
chai.config.showDiff = true;

const expect = chai.expect;

const locales = require('./locales');

const localize = require('../src/lib/localize').default;

describe('localization functions types', () => {
  it('simple string', () => {
    expect(localize(locales, 'simple string')).to.be.equal('simple translated string');
  });

  it('pluralization', () => {
    expect(localize(locales, 'pluralization', 1)).to.be.equal('singular');
    expect(localize(locales, 'pluralization', 2)).to.be.equal('plural');
  });

  it('interpolation {args1} {args2}', () => {
    expect(localize(locales, 'interpolation {args1} {args2}', { args1: 'foo', args2: 'bar' }))
      .to.be.equal('interpolated translated string foo bar');
  });

  it('interpolation and pluralization {args1} {args2}', () => {
    expect(localize(locales, 'interpolation and pluralization {args1} {args2}', { args1: 'foo', args2: 'bar' }, 1))
      .to.be.equal('interpolated and pluralizated string - singular foo bar');
    expect(localize(locales, 'interpolation and pluralization {args1} {args2}', { args1: 'foo', args2: 'bar' }, 2))
      .to.be.equal('interpolated and pluralizated string - plural foo bar');
  });

  it('array interpolation ?, ?', () => {
    expect(localize(locales, 'array interpolation ?, ?', ['foo', 'bar']))
      .to.be.equal('array interpolated string foo, bar');
  });

  it('array interpolation and pluralization ? ?', () => {
    expect(localize(locales, 'array interpolation and pluralization ? ?', ['foo', 'bar'], 1))
      .to.be.equal('array interplated and pluralizated string singular foo bar');
    expect(localize(locales, 'array interpolation and pluralization ? ?', ['foo', 'bar'], 2))
      .to.be.equal('array interplated and pluralizated string plural foo bar');
  });
});
