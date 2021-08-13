import { combineReducers } from 'redux';
import wallet from './wallet';
import tabs from './tabs';
import updater from './updater';
import fund from './fund';
import zindex from './zindex';
import quotation from './quotation';
import stock from './stock';
import coin from './coin';
import setting from './setting';
import sort from './sort';

export default function createRootReducer() {
  return combineReducers({
    wallet,
    tabs,
    updater,
    fund,
    zindex,
    quotation,
    stock,
    coin,
    setting,
    sort,
  });
}
