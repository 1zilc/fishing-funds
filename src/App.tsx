import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CONST_ROUTES from '@/constants/routes.json';
import HomePage from '@/containers/HomePage';
import { useUpdater } from '@/utils/hooks';
import '@/app.global.scss';

const App: React.FC<{}> = () => {
  useUpdater();

  return (
    <Router>
      <Switch>
        <Route path={CONST_ROUTES.HOME} component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
