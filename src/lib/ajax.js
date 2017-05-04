/* global XMLHttpRequest */
export default function ({
  url,
  method = 'GET',
  data,
  form = false,
}) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  let cancelPromise = () => {};
  const ret = {
    promise: new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 400) {
          let responseJson;
          try {
            responseJson = JSON.parse(xhr.responseText);
          } catch (e) {
            resolve(xhr.responseText);
          }
          resolve(responseJson);
        } else {
          reject(xhr.responseText);
        }
      };
      cancelPromise = () => {  // SPECIFY CANCELLATION
        xhr.abort(); // abort request
        reject('Cancelled'); // reject the promise
      };
      xhr.onerror = reject;
    }),
  };
  ret.cancel = cancelPromise;
  // TODO: HAY QUE HACER REFACTOR A ESTO
  if (method === 'POST') {
    if (typeof data === 'object') {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      if (form) {
        // JSON as form
        xhr.send(Object.keys(data).map(key => `${key}=${data[key]}`).join('&'));
      } else {
        // RAW JSON
        xhr.send(JSON.stringify(data));
      }
    } else {
      // ROW DATA
      xhr.send(data);
    }
  } else {
    // GET
    xhr.send();
  }
  return ret;
}
