export default function interpolateArray(key, params = []) {
  let interpolatedKey = key;
  params.forEach((param) => {
    interpolatedKey = interpolatedKey.replace(/\?/, param);
  });
  return interpolatedKey;
}
