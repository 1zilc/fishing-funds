import React, { Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import ThemeProvider from '@/components/ThemeProvider';
import { useAppSelector, useThemeColor } from '@/utils/hooks';
import * as CONST from '@/constants';
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

const App: React.FC<Record<string, unknown>> = () => {
  const darkMode = useAppSelector((state) => state.setting.darkMode);
  const baseFontSizeSetting = useAppSelector((state) => state.setting.systemSetting.baseFontSizeSetting);
  const lowKeySetting = useAppSelector((state) => state.setting.systemSetting.lowKeySetting);
  const { customThemeColorEnable, customThemeColorSetting, originPrimaryColor } = useThemeColor();

  return (
    <ThemeProvider
      config={{
        darkMode,
        lowKey: lowKeySetting,
        baseFontSize: baseFontSizeSetting,
        primaryColor: customThemeColorEnable ? customThemeColorSetting || originPrimaryColor : originPrimaryColor,
      }}
    >
      <Router>
        <Suspense fallback={<LoadingScreen loading text="请稍后..." />}>
          <Routes>
            <Route path={CONST.ROUTES.INIT} element={<InitPage />} />
            <Route path={CONST.ROUTES.HOME} element={<HomePage />} />
            <Route path={CONST.ROUTES.DETAIL} element={<DetailPage />}>
              <Route path={CONST.ROUTES.DETAIL_FUND} element={<DetailFundPage />} />
              <Route path={CONST.ROUTES.DETAIL_ZINDEX} element={<DetailZindexPage />} />
              <Route path={CONST.ROUTES.DETAIL_QUOTATION} element={<DetailQuotationPage />} />
              <Route path={CONST.ROUTES.DETAIL_STOCK} element={<DetailStockPage />} />
              <Route path={CONST.ROUTES.DETAIL_COIN} element={<DetailCoinPage />} />
              <Route path={CONST.ROUTES.DETAIL_WEBVIEWER} element={<WebViewerPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
