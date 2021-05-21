import {
  Dispatch as ReduxDispatch,
  Store as ReduxStore,
  Action,
  AnyAction,
} from 'redux';
import { ToolbarState } from './toolbar';
import { WalletState } from './wallet';
import { TabsState } from './tabs';
import { UpdaderState } from './updater';
import { FundState } from './fund';
import { ZindexState } from './zindex';
import { QuotationState } from './quotation';
import { SettingState } from './setting';

export interface StoreState {
  toolbar: ToolbarState;
  wallet: WalletState;
  tabs: TabsState;
  updater: UpdaderState;
  fund: FundState;
  zindex: ZindexState;
  quotation: QuotationState;
  setting: SettingState;
}

export type GetState = () => StoreState;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<StoreState, AnyAction>;
