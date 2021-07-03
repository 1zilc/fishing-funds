import React from 'react';
import { render } from 'react-dom';
import NP from 'number-precision';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { configureStore } from '@/store/configureStore';
import App from '@/App';
import * as Utils from '@/utils';
import 'electron-disable-file-drop';
import '@/utils/window';

Utils.ClearExpiredStorage();

const store = configureStore();

NP.enableBoundaryChecking(false);

render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
);
