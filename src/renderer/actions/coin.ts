import { batch } from 'react-redux';
import { TypedThunk } from '@/store';
import { syncCoins, syncCoinsConfig, setRemoteCoins } from '@/store/features/coin';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

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
    } catch (error) {
      console.log(error);
    }
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

      coinConfig.forEach((item, index) => {
        if (code === item.code) {
          coinConfig.splice(index, 1);
          dispatch(setCoinConfigAction(coinConfig));
        }
      });
    } catch (error) {}
  };
}

export function setCoinConfigAction(coinConfig: Coin.SettingItem[]): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        coin: { coins },
      } = getState();

      const codeMap = Utils.GetCodeMap(coinConfig, 'code');
      await Utils.SetStorage(CONST.STORAGE.COIN_SETTING, coinConfig);

      batch(() => {
        dispatch(syncCoinsConfig({ coinConfig, codeMap }));
        dispatch(syncCoinsStateAction(coins));
      });
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
      const sortList = Utils.DeepCopy(coins);

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
  return async (dispatch, getState) => {
    try {
      const {
        coin: { remoteCoins },
      } = getState();

      const oldRemoteMap = Utils.GetCodeMap(remoteCoins, 'code');
      const newRemoteMap = Utils.GetCodeMap(newRemoteCoins, 'code');
      const remoteMap = { ...oldRemoteMap, ...newRemoteMap };

      await Utils.SetStorage(CONST.STORAGE.REMOTE_COIN_MAP, remoteMap);

      dispatch(setRemoteCoins(Object.values(remoteMap)));
    } catch (error) {}
  };
}
