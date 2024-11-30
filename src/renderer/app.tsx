import React, { Suspense } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import ThemeProvider from '@/components/ThemeProvider';
import { useAppSelector, useThemeColor } from '@/utils/hooks';
import * as CONST from '@/constants';

import 'antd/dist/reset.css';
import '@/styles/antd.scss';
import '@/styles/button.scss';
import '@/styles/color.scss';
import '@/styles/common.scss';
import '@/app.scss';

const HomePage = React.lazy(() => import('@/containers/HomePage'));
const InitPage = React.lazy(() => import('@/containers/InitPage'));
const DetailPage = React.lazy(() => import('@/containers/DetailPage'));
const DetailFundPage = React.lazy(() => import('@/components/Home/FundView/DetailFundPage'));
const DetailZindexPage = React.lazy(() => import('@/components/Home/ZindexView/DetailZindexPage'));
const DetailStockPage = React.lazy(() => import('@/components/Home/StockView/DetailStockPage'));
const DetailQuotationPage = React.lazy(() => import('@/components/Home/QuotationView/DetailQuotationPage'));
const DetailCoinPage = React.lazy(() => import('@/components/Home/CoinView/DetailCoinPage'));
const WebViewerPage = React.lazy(() => import('@/components/WebViewerDrawer/WebViewerPage'));

const router = createMemoryRouter(
  [
    {
      path: CONST.ROUTES.INIT,
      element: <InitPage />,
    },
    {
      path: CONST.ROUTES.HOME,
      element: <HomePage />,
    },
    {
      path: CONST.ROUTES.DETAIL,
      element: <DetailPage />,
      children: [
        {
          path: CONST.ROUTES.DETAIL_FUND,
          element: <DetailFundPage />,
        },
        {
          path: CONST.ROUTES.DETAIL_ZINDEX,
          element: <DetailZindexPage />,
        },
        {
          path: CONST.ROUTES.DETAIL_QUOTATION,
          element: <DetailQuotationPage />,
        },
        {
          path: CONST.ROUTES.DETAIL_STOCK,
          element: <DetailStockPage />,
        },
        {
          path: CONST.ROUTES.DETAIL_COIN,
          element: <DetailCoinPage />,
        },
        {
          path: CONST.ROUTES.DETAIL_WEBVIEWER,
          element: <WebViewerPage />,
        },
      ],
    },
  ],
  { initialEntries: ['/'] }
);

const App: React.FC<Record<string, unknown>> = () => {
  const darkMode = useAppSelector((state) => state.setting.darkMode);
  const baseFontSizeSetting = useAppSelector((state) => state.setting.systemSetting.baseFontSizeSetting);
  const lowKeySetting = useAppSelector((state) => state.setting.systemSetting.lowKeySetting);
  const lowKeyDegreeSetting = useAppSelector((state) => state.setting.systemSetting.lowKeyDegreeSetting);
  const { customThemeColorEnable, customThemeColorSetting, originPrimaryColor } = useThemeColor();

  return (
    <ThemeProvider
      config={{
        darkMode,
        lowKey: lowKeySetting,
        lowKeyDegree: lowKeyDegreeSetting,
        baseFontSize: baseFontSizeSetting,
        primaryColor: customThemeColorEnable ? customThemeColorSetting || originPrimaryColor : originPrimaryColor,
      }}
    >
      <Suspense fallback={<LoadingScreen loading text="请稍后..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
