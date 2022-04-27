import { configureStore, AnyAction, ThunkAction, ThunkDispatch, Middleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import coinReducer, { CoinState } from '@/store/features/coin';
import fundReducer, { FundState } from '@/store/features/fund';
import quotationReducer, { QuotationState } from '@/store/features/quotation';
import settingReducer, { SettingState } from '@/store/features/setting';
import sortReducer, { SortState } from '@/store/features/sort';
import stockReducer, { StockState } from '@/store/features/stock';
import tabsReducer, { TabsState } from '@/store/features/tabs';
import updaterReducer, { UpdaderState } from '@/store/features/updater';
import walletReducer, { WalletState } from '@/store/features/wallet';
import webReducer, { WebState } from '@/store/features/web';
import zindexReducer, { ZindexState } from '@/store/features/zindex';

const { production } = window.contextModules.process;

const middleware: Middleware[] = [];

if (!production) {
  // middleware.push(logger);
}

const store = configureStore({
  reducer: {
    coin: coinReducer,
    fund: fundReducer,
    quotation: quotationReducer,
    setting: settingReducer,
    sort: sortReducer,
    stock: stockReducer,
    tabs: tabsReducer,
    updater: updaterReducer,
    wallet: walletReducer,
    web: webReducer,
    zindex: zindexReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
  devTools: !production,
});

/* Types */
export type StoreState = {
  wallet: WalletState;
  tabs: TabsState;
  updater: UpdaderState;
  fund: FundState;
  zindex: ZindexState;
  quotation: QuotationState;
  stock: StockState;
  setting: SettingState;
  sort: SortState;
  coin: CoinState;
  web: WebState;
};

export type AppDispatch = typeof store.dispatch;
export type TypedDispatch = ThunkDispatch<StoreState, any, AnyAction>;
export type TypedThunk<ReturnType = void> = ThunkAction<ReturnType, StoreState, unknown, AnyAction>;

export default store;
