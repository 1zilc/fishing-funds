import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export interface CoinState {
  coins: (Coin.ResponseItem & Coin.ExtraRow)[];
  coinsLoading: boolean;
  config: {
    coinConfig: Coin.SettingItem[];
    codeMap: Coin.CodeMap;
  };
  remoteCoins: Coin.RemoteCoin[];
  remoteCoinsMap: Record<string, Coin.RemoteCoin>;
  remoteCoinsLoading: boolean;
}

const initialState: CoinState = {
  coins: [],
  coinsLoading: false,
  config: { coinConfig: [], codeMap: {} },
  remoteCoins: [],
  remoteCoinsMap: {},
  remoteCoinsLoading: false,
};

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    setCoinsLoadingAction(state, action: PayloadAction<boolean>) {
      state.coinsLoading = action.payload;
    },
    filterCoinsAction(state) {
      state.coins = state.coins.filter(({ code }) => state.config.codeMap[code]);
    },
    syncCoinsStateAction(state, { payload }: PayloadAction<CoinState['coins']>) {
      state.coins = payload;
    },
    syncCoinsConfigAction(state, action: PayloadAction<CoinState['config']>) {
      state.config = action.payload;
    },
    syncRemoteCoinsMapAction(state, { payload }: PayloadAction<Record<string, Coin.RemoteCoin>>) {
      state.remoteCoins = Object.values(payload);
      state.remoteCoinsMap = payload;
    },
    setRemoteCoinsLoadingAction(state, action: PayloadAction<boolean>) {
      state.remoteCoinsLoading = action.payload;
    },
    toggleCoinCollapseAction(state, { payload }: PayloadAction<CoinState['coins'][number]>) {
      Helpers.Base.Collapse({
        list: state.coins,
        key: 'code',
        data: payload,
      });
    },
    toggleAllCoinsCollapseAction(state) {
      Helpers.Base.CollapseAll({
        list: state.coins,
      });
    },
  },
});

export const {
  setCoinsLoadingAction,
  syncCoinsStateAction,
  filterCoinsAction,
  syncCoinsConfigAction,
  syncRemoteCoinsMapAction,
  setRemoteCoinsLoadingAction,
  toggleCoinCollapseAction,
  toggleAllCoinsCollapseAction,
} = coinSlice.actions;

export const addCoinAction = createAsyncThunk<void, Coin.SettingItem, AsyncThunkConfig>(
  'coin/addCoinAction',
  (coin, { dispatch, getState }) => {
    try {
      const {
        coin: {
          config: { coinConfig },
        },
      } = getState();

      const config = Helpers.Base.Add({
        list: Utils.DeepCopy(coinConfig),
        key: 'code',
        data: coin,
      });

      dispatch(setCoinConfigAction(config));
    } catch (error) {}
  }
);

export const updateCoinAction = createAsyncThunk<
  void,
  Partial<Coin.SettingItem> & {
    code: string;
  },
  AsyncThunkConfig
>('coin/updateCoinAction', (coin, { dispatch, getState }) => {
  try {
    const {
      coin: {
        config: { coinConfig },
      },
    } = getState();

    const config = Helpers.Base.Update({
      list: Utils.DeepCopy(coinConfig),
      key: 'code',
      data: coin,
    });

    dispatch(setCoinConfigAction(config));
  } catch (error) {}
});

export const deleteCoinAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'coin/deleteCoinAction',
  (code, { dispatch, getState }) => {
    try {
      const {
        coin: {
          config: { coinConfig },
        },
      } = getState();

      const config = Helpers.Base.Delete({
        list: Utils.DeepCopy(coinConfig),
        key: 'code',
        data: code,
      });

      dispatch(setCoinConfigAction(config));
    } catch (error) {}
  }
);

export const sortCoinsAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'coin/sortCoinsAction',
  (_, { dispatch, getState }) => {
    try {
      const {
        coin: {
          coins,
          config: { codeMap },
        },
        sort: {
          sortMode: {
            coinSortMode: { order, type },
          },
        },
      } = getState();

      const sortList = Helpers.Coin.SortCoin({
        codeMap,
        list: coins,
        sortType: type,
        orderType: order,
      });

      dispatch(syncCoinsStateAction(sortList));
    } catch (error) {}
  }
);

export const sortCoinsCachedAction = createAsyncThunk<void, Coin.ResponseItem[], AsyncThunkConfig>(
  'coin/sortCoinsCachedAction',
  (responseCoins, { dispatch, getState }) => {
    try {
      const {
        coin: {
          coins,
          config: { coinConfig },
        },
      } = getState();

      const coinsWithChached = Utils.MergeStateWithResponse({
        config: coinConfig,
        configKey: 'code',
        stateKey: 'code',
        state: coins,
        response: responseCoins,
      });

      dispatch(syncCoinsStateAction(coinsWithChached));
      dispatch(sortCoinsAction());
    } catch (error) {}
  }
);

export const setCoinConfigAction = createAsyncThunk<void, Coin.SettingItem[], AsyncThunkConfig>(
  'coin/setCoinConfigAction',
  (coinConfig, { dispatch }) => {
    try {
      const codeMap = Utils.GetCodeMap(coinConfig, 'code');
      dispatch(syncCoinsConfigAction({ coinConfig, codeMap }));

      dispatch(filterCoinsAction());
    } catch (error) {}
  }
);

export const setRemoteCoinsAction = createAsyncThunk<void, Coin.RemoteCoin[], AsyncThunkConfig>(
  'coin/setRemoteCoinsAction',
  (newRemoteCoins, { dispatch, getState }) => {
    try {
      const {
        coin: { remoteCoins },
      } = getState();

      const oldRemoteMap = Utils.GetCodeMap(remoteCoins, 'code');
      const newRemoteMap = Utils.GetCodeMap(newRemoteCoins, 'code');
      const remoteMap = { ...oldRemoteMap, ...newRemoteMap };

      dispatch(syncRemoteCoinsMapAction(remoteMap));
    } catch (error) {}
  }
);

export default coinSlice.reducer;
