declare global {
  interface Window {
    cb: <T>(response: T) => T;
  }
}

window.cb = (response) => {
  return response;
};

export default {};
