import { createRoot } from 'react-dom/client';
import { IconContext } from 'react-icons';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import NP from 'number-precision';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  ScatterChart,
  TreemapChart,
  CandlestickChart,
  SunburstChart,
  GaugeChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Provider } from 'react-redux';
import chinaMap from '@/static/map/china.json';
import store from '@/store';
import App from '@/app';
import * as Enhancement from '@/utils/enhancement';
import '@ant-design/v5-patch-for-react-19';
import 'dayjs/locale/zh-cn';
import '@/utils/window';

// 环境工具
Enhancement.CheckEnvTool();
// dayjs
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('zh-cn');
// echarts
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  ScatterChart,
  TreemapChart,
  CandlestickChart,
  SunburstChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
]);
echarts.registerMap('china', chinaMap as any);
// np检测
NP.enableBoundaryChecking(false);

const { platform } = window.contextModules.process;

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <style>
      {`:root{
        background-color: ${platform === 'darwin' ? 'initial' : 'var(--inner-color)'};
      }`}
    </style>
    <Provider store={store}>
      <IconContext.Provider value={{ size: '16px' }}>
        <App />
      </IconContext.Provider>
    </Provider>
  </ConfigProvider>
);
