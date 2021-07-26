declare global {
  interface Window {
    jsonpgz: <T>(response: T) => T;
  }
}

window.jsonpgz = (response) => {
  return response;
};

export {};
