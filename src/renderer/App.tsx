import React, { Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import * as CONST from '@/constants';
import '@/app.scss';

const HomePage = React.lazy(() => import('@/containers/HomePage'));
const InitPage = React.lazy(() => import('@/containers/InitPage'));
const DetailPage = React.lazy(() => import('@/containers/DetailPage'));

const App: React.FC<Record<string, unknown>> = () => {
  console.log(window.location);
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  return (
    <Router initialEntries={[code ? CONST.ROUTES.DETAIL : CONST.ROUTES.INIT]}>
      <Suspense fallback={<LoadingScreen loading text="请稍后..." />}>
        <Routes>
          <Route path={CONST.ROUTES.INIT} element={<InitPage />} />
          <Route path={CONST.ROUTES.HOME} element={<HomePage />} />
          <Route path={CONST.ROUTES.DETAIL} element={<DetailPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
