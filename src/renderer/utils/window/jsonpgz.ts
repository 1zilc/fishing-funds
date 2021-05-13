declare global {
  interface Window {
    jsonpgz: <T>(response: T) => T;
  }
}

window.jsonpgz = function (response) {
  return response;
};

export {};
