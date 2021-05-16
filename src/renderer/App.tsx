import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as CONST from '@/constants';
import HomePage from '@/containers/HomePage';

import {
  useUpdater,
  useAdjustmentNotification,
  useConfigClipboard,
} from '@/utils/hooks';
import '@/app.global.scss';

const App: React.FC<{}> = () => {
  useUpdater();
  useAdjustmentNotification();
  useConfigClipboard();

  return (
    <Router>
      <Switch>
        <Route path={CONST.ROUTES.HOME} component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
