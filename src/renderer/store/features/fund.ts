import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import dayjs from 'dayjs';

import { AsyncThunkConfig } from '@/store';
import { setWalletConfigAction, updateWalletStateAction, setWalletStateAction } from '@/store/features/wallet';
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
  async ({ config, walletCode }, { dispatch, getState }) => {
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

      batch(() => {
        dispatch(setWalletConfigAction(newWalletConfig));
        dispatch(updateWalletStateAction(currentWallet));
      });
    } catch (error) {}
  }
);

export const setRemoteFundsAction = createAsyncThunk<void, Fund.RemoteFund[], AsyncThunkConfig>(
  'fund/setRemoteFundsAction',
  async (newRemoteFunds, { dispatch, getState }) => {
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

export const setFundRatingMapAction = createAsyncThunk<void, Fund.RantingItem[], AsyncThunkConfig>(
  'fund/setFundRatingMapAction',
  async (newFundRantings, { dispatch, getState }) => {
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
  async (fund, { dispatch, getState }) => {
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
>('fund/updateFundAction', async (fund, { dispatch, getState }) => {
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
  async (code, { dispatch, getState }) => {
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
  async (walletCode, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          wallets,
          config: { walletConfig },
        },
        sort: {
          sortMode: {
            fundSortMode: { type: fundSortType, order: fundSortorder },
          },
        },
      } = getState();
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState(walletCode, wallets);
      const { codeMap } = Helpers.Fund.GetFundConfig(walletCode, walletConfig);
      const sortList = funds.slice();

      sortList.sort((a, b) => {
        const calcA = Helpers.Fund.CalcFund(a, codeMap);
        const calcB = Helpers.Fund.CalcFund(b, codeMap);
        const t = fundSortorder === Enums.SortOrderType.Asc ? 1 : -1;

        switch (fundSortType) {
          case Enums.FundSortType.Growth:
            return (Number(calcA.gszzl) - Number(calcB.gszzl)) * t;
          case Enums.FundSortType.Cost:
            return (Number(calcA.cbje || 0) - Number(calcB.cbje || 0)) * t;
          case Enums.FundSortType.Money:
            return (Number(calcA.jrsygz) - Number(calcB.jrsygz)) * t;
          case Enums.FundSortType.Estimate:
            return (Number(calcA.gszz) - Number(calcB.gszz)) * t;
          case Enums.FundSortType.Income:
            return (Number(calcA.cysy || 0) - Number(calcB.cysy || 0)) * t;
          case Enums.FundSortType.IncomeRate:
            return (Number(calcA.cysyl) - Number(calcB.cysyl || 0)) * t;
          case Enums.FundSortType.Name:
            return calcA.name!.localeCompare(calcB.name!, 'zh') * t;
          case Enums.FundSortType.Custom:
          default:
            return (codeMap[b.fundcode!]?.originSort - codeMap[a.fundcode!]?.originSort) * t;
        }
      });

      dispatch(setWalletStateAction({ code, funds: sortList, updateTime }));
    } catch (error) {}
  }
);

export const sortFundsCachedAction = createAsyncThunk<void, { responseFunds: Fund.ResponseItem[]; walletCode: string }, AsyncThunkConfig>(
  'fund/sortFundsCachedAction',
  async ({ responseFunds, walletCode }, { dispatch, getState }) => {
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
      const fundsWithChached = Utils.MergeStateWithResponse(fundConfig, 'code', 'fundcode', funds, responseFunds);

      batch(() => {
        dispatch(setWalletStateAction({ code: walletCode, funds: fundsWithChached, updateTime: now }));
        dispatch(sortFundsAction(walletCode));
      });
    } catch (error) {}
  }
);

export default fundSlice.reducer;
