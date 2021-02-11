import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import toolbar from './toolbar';
import wallet from './wallet';
import tabs from './tabs';
import updater from './updater';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    toolbar,
    wallet,
    tabs,
    updater,
  });
}
