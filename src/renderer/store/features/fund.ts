import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { AsyncThunkConfig } from '@/store';
import { setWalletConfigAction, updateWalletStateAction, setWalletStateAction } from '@/store/features/wallet';
import { sortFund } from '@/workers/sort.worker';
import { mergeStateWithResponse } from '@/workers/merge.worker';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';

export interface FundState {
  fundsLoading: boolean;
  remoteFunds: Fund.RemoteFund[];
  remoteFundsMap: Record<string, Fund.RemoteFund>;
  remoteFundsLoading: boolean;
  fundRatingMap: Record<string, Fund.RantingItem>;
}

const initialState: FundState = {
  fundsLoading: false,
  remoteFunds: [],
  remoteFundsMap: {},
  remoteFundsLoading: false,
  fundRatingMap: {},
};

const fundSlice = createSlice({
  name: 'fund',
  initialState,
  reducers: {
    syncRemoteFundsMapAction(state, { payload }: PayloadAction<Record<string, Fund.RemoteFund>>) {
      state.remoteFunds = Object.values(payload);
      state.remoteFundsMap = payload;
    },
    setFundsLoadingAction(state, action: PayloadAction<boolean>) {
      state.fundsLoading = action.payload;
    },
    setRemoteFundsLoadingAction(state, action: PayloadAction<boolean>) {
      state.remoteFundsLoading = action.payload;
    },
    syncFundRatingMapAction(state, action: PayloadAction<Record<string, Fund.RantingItem>>) {
      state.fundRatingMap = action.payload;
    },
  },
});

export const { syncRemoteFundsMapAction, setFundsLoadingAction, setRemoteFundsLoadingAction, syncFundRatingMapAction } = fundSlice.actions;

export const setFundConfigAction = createAsyncThunk<void, { config: Fund.SettingItem[]; walletCode: string }, AsyncThunkConfig>(
  'fund/setFundConfigAction',
  ({ config, walletCode }, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
          currentWallet,
        },
      } = getState();
      const newWalletConfig = walletConfig.map((item) => ({
        ...item,
        funds: walletCode === item.code ? config : item.funds,
      }));

      dispatch(setWalletConfigAction(newWalletConfig));
      dispatch(updateWalletStateAction(currentWallet));
    } catch (error) {}
  }
);

export const setRemoteFundsAction = createAsyncThunk<void, Fund.RemoteFund[], AsyncThunkConfig>(
  'fund/setRemoteFundsAction',
  (newRemoteFunds, { dispatch, getState }) => {
    try {
      const {
        fund: { remoteFunds },
      } = getState();
      const oldRemoteMap = Utils.GetCodeMap(remoteFunds, 0);
      const newRemoteMap = Utils.GetCodeMap(newRemoteFunds, 0);
      const remoteMap = { ...oldRemoteMap, ...newRemoteMap };
      dispatch(syncRemoteFundsMapAction(remoteMap));
    } catch (error) {}
  }
);

export const setFundRatingAction = createAsyncThunk<void, Fund.RantingItem[], AsyncThunkConfig>(
  'fund/setFundRatingAction',
  (newFundRantings, { dispatch, getState }) => {
    try {
      const {
        fund: { fundRatingMap: oldFundRatingMap },
      } = getState();

      const nweFundRantingMap = Utils.GetCodeMap(newFundRantings, 'code');
      const fundRatingMap = { ...oldFundRatingMap, ...nweFundRantingMap };

      dispatch(syncFundRatingMapAction(fundRatingMap));
    } catch (error) {}
  }
);

export const addFundAction = createAsyncThunk<void, Fund.SettingItem, AsyncThunkConfig>(
  'fund/addFundAction',
  (fund, { dispatch, getState }) => {
    try {
      const {
        wallet: { currentWalletCode, fundConfig },
      } = getState();
      const exist = fundConfig.find((item) => fund.code === item.code);
      if (!exist) {
        dispatch(setFundConfigAction({ config: fundConfig.concat(fund), walletCode: currentWalletCode }));
      }
    } catch (error) {}
  }
);

export const updateFundAction = createAsyncThunk<
  void,
  {
    code: string;
    cyfe?: number;
    name?: string;
    cbj?: number;
    zdfRange?: number;
    jzNotice?: number;
    memo?: string;
  },
  AsyncThunkConfig
>('fund/updateFundAction', (fund, { dispatch, getState }) => {
  try {
    const {
      wallet: { currentWalletCode, fundConfig },
    } = getState();
    const cloneFundConfig = Utils.DeepCopy(fundConfig);
    cloneFundConfig.forEach((item) => {
      if (fund.code === item.code) {
        Object.keys(fund).forEach((key) => {
          (item[key as keyof Fund.SettingItem] as any) = fund[key as keyof Fund.SettingItem];
        });
      }
    });

    dispatch(setFundConfigAction({ config: cloneFundConfig, walletCode: currentWalletCode }));
  } catch (error) {}
});

export const deleteFundAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'fund/deleteFundAction',
  (code, { dispatch, getState }) => {
    try {
      const {
        wallet: { currentWalletCode, fundConfig },
      } = getState();
      fundConfig.forEach((item, index) => {
        if (code === item.code) {
          const cloneFundConfig = Utils.DeepCopy(fundConfig);
          cloneFundConfig.splice(index, 1);
          dispatch(setFundConfigAction({ config: cloneFundConfig, walletCode: currentWalletCode }));
        }
      });
    } catch (error) {}
  }
);

export const sortFundsAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'fund/sortFundsAction',
  (walletCode, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          wallets,
          config: { walletConfig },
        },
        sort: {
          sortMode: {
            fundSortMode: { type, order },
          },
        },
      } = getState();
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState(walletCode, wallets);
      const { codeMap } = Helpers.Fund.GetFundConfig(walletCode, walletConfig);

      const sortList = sortFund({
        module: Enums.TabKeyType.Fund,
        codeMap,
        list: funds,
        sortType: type,
        orderType: order,
      });

      dispatch(setWalletStateAction({ code, funds: sortList, updateTime }));
    } catch (error) {}
  }
);

export const sortFundsCachedAction = createAsyncThunk<void, { responseFunds: Fund.ResponseItem[]; walletCode: string }, AsyncThunkConfig>(
  'fund/sortFundsCachedAction',
  ({ responseFunds, walletCode }, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
          wallets,
        },
      } = getState();
      const { fundConfig } = Helpers.Fund.GetFundConfig(walletCode, walletConfig);
      const { funds } = Helpers.Wallet.GetCurrentWalletState(walletCode, wallets);
      const now = dayjs().format('MM-DD HH:mm:ss');

      const fundsWithChached = mergeStateWithResponse({
        config: fundConfig,
        configKey: 'code',
        stateKey: 'fundcode',
        state: funds,
        response: responseFunds,
      });

      dispatch(setWalletStateAction({ code: walletCode, funds: fundsWithChached, updateTime: now }));
      dispatch(sortFundsAction(walletCode));
    } catch (error) {}
  }
);

export default fundSlice.reducer;
