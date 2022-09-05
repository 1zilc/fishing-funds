import 'react';
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      webview: Electron.WebviewTag;
    }
  }
}
