export default function interpolateObject(key, params) {
  let str = key;
  key.match(/\{[\w]+\}/g).forEach((param) => {
    const interpolateKey = param.replace(/\{?\}?/g, '');
    const regex = new RegExp(param, 'g');
    str = str.replace(regex, params[interpolateKey]);
  });
  return str;
}
