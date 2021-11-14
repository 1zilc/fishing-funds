import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/containers/HomePage';
import * as CONST from '@/constants';

import {
  useUpdater,
  useAdjustmentNotification,
  useRiskNotification,
  useFundsClipboard,
  useBootStrap,
  useMappingLocalToSystemSetting,
  useTrayContent,
  useUpdateContextMenuWalletsState,
  useAllConfigBackup,
} from '@/utils/hooks';
import '@/app.scss';

const App: React.FC<Record<string, unknown>> = () => {
  useUpdater();
  useAdjustmentNotification();
  useRiskNotification();
  useFundsClipboard();
  useAllConfigBackup();
  useTrayContent();
  useMappingLocalToSystemSetting();
  useUpdateContextMenuWalletsState();
  useBootStrap();

  return (
    <Router>
      <Routes>
        <Route path={CONST.ROUTES.HOME} element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
