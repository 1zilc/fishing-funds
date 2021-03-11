import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from '@/App';
import { configureStore } from './store/configureStore';
import 'electron-disable-file-drop';
import '@/utils/window';

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
