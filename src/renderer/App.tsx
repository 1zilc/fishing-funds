import React, { Suspense } from 'react';
import { ConfigProvider, theme } from 'antd';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { useAppSelector } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
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

const params = Utils.ParseSearchParams();

const App: React.FC<Record<string, unknown>> = () => {
  const darkMode = useAppSelector((state) => state.setting.darkMode);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? [theme.darkAlgorithm] : [],
      }}
    >
      <Router>
        <Suspense fallback={<LoadingScreen loading text="请稍后..." />}>
          <Routes>
            <Route path={CONST.ROUTES.INIT} element={<InitPage />} />
            <Route path={CONST.ROUTES.HOME} element={<HomePage />} />
            <Route path={CONST.ROUTES.DETAIL} element={<DetailPage />}>
              <Route path="fund" element={<DetailFundPage code={params.get('code')!} />} />
              <Route path="zindex" element={<DetailZindexPage code={params.get('code')!} />} />
              <Route path="quotation" element={<DetailQuotationPage code={params.get('code')!} />} />
              <Route
                path="stock"
                element={
                  <DetailStockPage secid={params.get('secid')!} type={params.get('type') ? Number(params.get('type')) : undefined} />
                }
              />
              <Route path="coin" element={<DetailCoinPage code={params.get('code')!} />} />
              <Route
                path="webViewer"
                element={
                  <WebViewerPage full url={params.get('url')!} phone={params.get('phone') === 'true'} title={params.get('title')!} />
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ConfigProvider>
  );
};

export default App;
