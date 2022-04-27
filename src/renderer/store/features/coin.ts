import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { TypedThunk } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

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
    setCoinsLoading(state, action: PayloadAction<boolean>) {
      state.coinsLoading = action.payload;
    },
    syncCoins(state, action) {
      state.coins = action.payload;
    },
    syncCoinsConfig(state, action) {
      state.config = action.payload;
    },
    setRemoteCoins(state, { payload }: PayloadAction<Coin.RemoteCoin[]>) {
      state.remoteCoins = payload;
      state.remoteCoinsMap = Utils.GetCodeMap(payload, 'code');
    },
    setRemoteCoinsLoading(state, action: PayloadAction<boolean>) {
      state.remoteCoinsLoading = action.payload;
    },
    toggleCoinCollapseAction(state, { payload }: PayloadAction<Coin.ResponseItem & Coin.ExtraRow>) {
      const { coins } = state;
      coins.forEach((item) => {
        if (item.code === payload.code) {
          item.collapse = !payload.collapse;
        }
      });
    },
    toggleAllCoinsCollapseAction(state) {
      const { coins } = state;
      const expandAll = coins.every((item) => item.collapse);
      coins.forEach((item) => {
        item.collapse = !expandAll;
      });
    },
  },
});

export const {
  setCoinsLoading,
  syncCoins,
  syncCoinsConfig,
  setRemoteCoins,
  setRemoteCoinsLoading,
  toggleCoinCollapseAction,
  toggleAllCoinsCollapseAction,
} = coinSlice.actions;

export function addCoinAction(coin: Coin.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: {
          config: { coinConfig },
        },
      } = getState();
      const exist = coinConfig.find((item) => coin.code === item.code);
      if (!exist) {
        dispatch(setCoinConfigAction(coinConfig.concat(coin)));
      }
    } catch (error) {}
  };
}

export function deleteCoinAction(code: string): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: {
          config: { coinConfig },
        },
      } = getState();
      const cloneCoinConfig = coinConfig.slice();

      cloneCoinConfig.forEach((item, index) => {
        if (code === item.code) {
          cloneCoinConfig.splice(index, 1);
          dispatch(setCoinConfigAction(cloneCoinConfig));
        }
      });
    } catch (error) {}
  };
}

export function setCoinConfigAction(coinConfig: Coin.SettingItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: { coins },
      } = getState();

      const codeMap = Utils.GetCodeMap(coinConfig, 'code');

      batch(() => {
        dispatch(syncCoinsConfig({ coinConfig, codeMap }));
        dispatch(syncCoinsStateAction(coins));
      });

      Utils.SetStorage(CONST.STORAGE.COIN_SETTING, coinConfig);
    } catch (error) {}
  };
}

export function sortCoinsAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: {
          coins,
          config: { coinConfig },
        },
        sort: {
          sortMode: {
            coinSortMode: { order, type },
          },
        },
      } = getState();
      const codeMap = Utils.GetCodeMap(coinConfig, 'code');
      const sortList = coins.slice();

      sortList.sort((a, b) => {
        const t = order === Enums.SortOrderType.Asc ? 1 : -1;
        switch (type) {
          case Enums.CoinSortType.Price:
            return (Number(a.price) - Number(b.price)) * t;
          case Enums.CoinSortType.Zdf:
            return (Number(a.change24h) - Number(b.change24h)) * t;
          case Enums.CoinSortType.Volum:
            return (Number(a.vol24h) - Number(b.vol24h)) * t;
          case Enums.CoinSortType.Name:
            return b.code.localeCompare(a.code, 'zh') * t;
          case Enums.CoinSortType.Custom:
          default:
            return (codeMap[b.code!]?.originSort - codeMap[a.code!]?.originSort) * t;
        }
      });

      dispatch(syncCoinsStateAction(sortList));
    } catch (error) {}
  };
}

export function sortCoinsCachedAction(responseCoins: Coin.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: {
          coins,
          config: { coinConfig },
        },
      } = getState();

      const coinsCodeToMap = Utils.GetCodeMap(coins, 'code');
      const coinsWithChached = responseCoins.filter(Boolean).map((_) => ({
        ...(coinsCodeToMap[_.code] || {}),
        ..._,
      }));
      const coinsWithChachedCodeToMap = Utils.GetCodeMap(coinsWithChached, 'code');

      coinConfig.forEach((coin) => {
        const responseCoin = coinsWithChachedCodeToMap[coin.code];
        const stateCoin = coinsCodeToMap[coin.code];
        if (!responseCoin && stateCoin) {
          coinsWithChached.push(stateCoin);
        }
      });
      batch(() => {
        dispatch(syncCoinsStateAction(coinsWithChached));
        dispatch(sortCoinsAction());
      });
    } catch (error) {}
  };
}

export function syncCoinsStateAction(coins: (Coin.ResponseItem & Coin.ExtraRow)[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: {
          config: { codeMap },
        },
      } = getState();
      const filterCoins = coins.filter(({ code }) => codeMap[code]);
      dispatch(syncCoins(filterCoins));
    } catch (error) {}
  };
}

export function setRemoteCoinsAction(newRemoteCoins: Coin.RemoteCoin[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: { remoteCoins },
      } = getState();

      const oldRemoteMap = Utils.GetCodeMap(remoteCoins, 'code');
      const newRemoteMap = Utils.GetCodeMap(newRemoteCoins, 'code');
      const remoteMap = { ...oldRemoteMap, ...newRemoteMap };

      dispatch(setRemoteCoins(Object.values(remoteMap)));
      Utils.SetStorage(CONST.STORAGE.REMOTE_COIN_MAP, remoteMap);
    } catch (error) {}
  };
}

export default coinSlice.reducer;
