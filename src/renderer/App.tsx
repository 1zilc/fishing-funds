import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/containers/HomePage';
import InitPage from '@/containers/InitPage';
import * as CONST from '@/constants';
import '@/app.scss';

const App: React.FC<Record<string, unknown>> = () => {
  return (
    <Router>
      <Routes>
        <Route path={CONST.ROUTES.INIT} element={<InitPage />} />
        <Route path={CONST.ROUTES.HOME} element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
