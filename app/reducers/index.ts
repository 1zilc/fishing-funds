import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import toolbar from './toolbar';
import wallet from './wallet';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    toolbar,
    wallet
  });
}
