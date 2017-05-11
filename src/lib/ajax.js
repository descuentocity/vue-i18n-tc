/* global XMLHttpRequest */
export default function ({ path, method = 'GET' }) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, path, true);
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
  xhr.send();
  return ret;
}
