import { combineReducers } from 'redux';
import toolbar from './toolbar';
import wallet from './wallet';
import tabs from './tabs';
import updater from './updater';
import fund from './fund';
import zindex from './zindex';
import quotation from './quotation';
import stock from './stock';
import setting from './setting';

export default function createRootReducer() {
  return combineReducers({
    toolbar,
    wallet,
    tabs,
    updater,
    fund,
    zindex,
    quotation,
    stock,
    setting,
  });
}
