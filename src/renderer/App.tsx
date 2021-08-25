import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from '@/containers/HomePage';
import * as CONST from '@/constants';

import {
  useUpdater,
  useAdjustmentNotification,
  useConfigClipboard,
  useBootStrap,
  useMappingLocalToSystemSetting,
  useTrayContent,
  useUpdateContextMenuWalletsState,
} from '@/utils/hooks';
import '@/app.global.scss';

const App: React.FC<Record<string, unknown>> = () => {
  useUpdater();
  useAdjustmentNotification();
  useConfigClipboard();
  useTrayContent();
  useMappingLocalToSystemSetting();
  useUpdateContextMenuWalletsState();
  useBootStrap();

  return (
    <Router>
      <Switch>
        <Route path={CONST.ROUTES.HOME} component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
