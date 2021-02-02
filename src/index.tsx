import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { configureStore } from './store/configureStore';
import 'electron-disable-file-drop';

const store = configureStore();
const a = async () => {
  setInterval(() => {
    console.log(66666);
  }, 1000);
};
a();
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
