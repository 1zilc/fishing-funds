import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { configureStore } from '@/store/configureStore';
import App from '@/App';
import * as Utils from '@/utils';
import 'electron-disable-file-drop';
import '@/utils/window';

Utils.ClearExpiredStorage();

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
