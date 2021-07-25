import { Store as ReduxStore, Action, AnyAction, Dispatch as ReduxDispatch } from 'redux';
import { ThunkDispatch as ReduxThunkDispatch, ThunkAction as ReduxThunkAction } from 'redux-thunk';

import { WalletState } from './wallet';
import { TabsState } from './tabs';
import { UpdaderState } from './updater';
import { FundState } from './fund';
import { ZindexState } from './zindex';
import { QuotationState } from './quotation';
import { StockState } from './stock';
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
};

export type GetState = () => StoreState;

export type Dispatch = ReduxDispatch<any>;

export type Store = ReduxStore<StoreState, AnyAction>;

export type ThunkAction<T = void> = (dispatch: ReduxThunkDispatch<StoreState, unknown, Action<string>>, getState: GetState) => T;

export type PromiseAction<T = void> = (dispatch: Dispatch, getState: GetState) => Promise<T>;

export type Reducer<S> = (state: S, action: AnyAction) => S;
