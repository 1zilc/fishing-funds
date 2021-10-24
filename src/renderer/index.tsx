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

NP.enableBoundaryChecking(false);

Utils.CheckEnvTool();
Utils.InitSystemSettingStorage();
Utils.ClearExpiredStorage();

export const store = configureStore();

render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);
