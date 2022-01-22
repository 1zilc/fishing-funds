import { render } from 'react-dom';
import NP from 'number-precision';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { Provider } from 'react-redux';
import { configureStore } from '@/store/configureStore';
import App from '@/App';
import * as Utils from '@/utils';
import 'electron-disable-file-drop';
import '@/utils/window';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

echarts.registerMap('china', require('@/static/map/china.json'));

NP.enableBoundaryChecking(false);

Utils.CheckEnvTool();

export const store = configureStore();

render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);
