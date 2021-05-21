import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import toolbar from './toolbar';
import wallet from './wallet';
import tabs from './tabs';
import updater from './updater';
import fund from './fund';
import zindex from './zindex';
import quotation from './quotation';
import setting from './setting';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    toolbar,
    wallet,
    tabs,
    updater,
    fund,
    zindex,
    quotation,
    setting,
  });
}
