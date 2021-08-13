import { Store as ReduxStore, Action, AnyAction, Dispatch as ReduxDispatch } from 'redux';
import { ThunkDispatch as ReduxThunkDispatch, ThunkAction as ReduxThunkAction } from 'redux-thunk';

import { WalletState } from './wallet';
import { TabsState } from './tabs';
import { UpdaderState } from './updater';
import { FundState } from './fund';
import { ZindexState } from './zindex';
import { QuotationState } from './quotation';
import { StockState } from './stock';
import { CoinState } from './coin';
import { SettingState } from './setting';
import { SortState } from './sort';

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
};

export type GetState = () => StoreState;

export type Dispatch = ReduxThunkDispatch<StoreState, unknown, Action<string>>;

export type Store = ReduxStore<StoreState, any | Dispatch>;

export type ThunkAction<T = void> = (dispatch: Dispatch, getState: GetState) => T;

export type PromiseAction<T = void> = (dispatch: Dispatch, getState: GetState) => Promise<T>;

export type Reducer<S> = (state: S, action: any | Dispatch) => S;
