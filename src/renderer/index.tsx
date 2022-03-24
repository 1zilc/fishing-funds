import { render } from 'react-dom';
import NP from 'number-precision';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import * as echarts from 'echarts';
import chinaMap from '@/static/map/china.json';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { Provider } from 'react-redux';
import { configureStore } from '@/store/configureStore';
import App from '@/App';
import * as Utils from '@/utils';
import 'electron-disable-file-drop';
import 'dayjs/locale/zh-cn';
import '@/utils/window';
import '@/utils/request';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('zh-cn');

echarts.registerMap('china', chinaMap as any);

NP.enableBoundaryChecking(false);

Utils.CheckEnvTool();

export const store = configureStore();

const { platform } = window.contextModules.process;

render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <style>{` body { background-color: ${platform === 'darwin' ? 'initial' : 'var(--inner-color)'} }`}</style>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);
