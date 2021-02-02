import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CONST_ROUTES from './constants/routes.json';
import HomePage from './containers/HomePage';
import './app.global.scss';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path={CONST_ROUTES.HOME} component={HomePage} />
      </Switch>
    </Router>
  );
}
