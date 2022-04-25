import { batch } from 'react-redux';

import { TypedThunk } from '@/store';
import { syncCoins, syncCoinsConfig, setRemoteCoins } from '@/store/features/coin';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export function addCoinAction(coin: Coin.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { coinConfig } = Helpers.Coin.GetCoinConfig();
      const cloneCoinConfig = Utils.DeepCopy(coinConfig);
      const exist = cloneCoinConfig.find((item) => coin.code === item.code);
      if (!exist) {
        cloneCoinConfig.push(coin);
      }
      dispatch(setCoinConfigAction(cloneCoinConfig));
    } catch (error) {}
  };
}

export function deleteCoinAction(code: string): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { coinConfig } = Helpers.Coin.GetCoinConfig();

      coinConfig.forEach((item, index) => {
        if (code === item.code) {
          const cloneCoinSetting = JSON.parse(JSON.stringify(coinConfig));
          cloneCoinSetting.splice(index, 1);
          dispatch(setCoinConfigAction(cloneCoinSetting));
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
      const codeMap = Helpers.Coin.GetCodeMap(coinConfig);
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
        coin: { coins },
      } = getState();
      const sortCoins = Helpers.Coin.SortCoins(coins);
      dispatch(syncCoinsStateAction(sortCoins));
    } catch (error) {}
  };
}

export function sortCoinsCachedAction(responseCoins: Coin.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: { coins },
      } = getState();
      const { coinConfig } = Helpers.Coin.GetCoinConfig();

      const coinsCodeToMap = coins.reduce((map, coin) => {
        map[coin.code] = coin;
        return map;
      }, {} as any);

      const coinsWithChached = responseCoins.filter(Boolean).map((_) => ({
        ...(coinsCodeToMap[_.code] || {}),
        ..._,
      }));

      const coinsWithChachedCodeToMap = coinsWithChached.reduce((map, coin) => {
        map[coin.code] = coin;
        return map;
      }, {} as any);

      coinConfig.forEach((coin) => {
        const responseCoin = coinsWithChachedCodeToMap[coin.code];
        const stateCoin = coinsCodeToMap[coin.code];
        if (!responseCoin && stateCoin) {
          coinsWithChached.push(stateCoin);
        }
      });
      const sortCoins = Helpers.Coin.SortCoins(coinsWithChached);
      dispatch(syncCoinsStateAction(sortCoins));
    } catch (error) {}
  };
}

export function toggleCoinCollapseAction(coin: Coin.ResponseItem & Coin.ExtraRow): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        coin: { coins },
      } = getState();

      const cloneCoins = Utils.DeepCopy(coins);
      cloneCoins.forEach((_) => {
        if (_.code === coin.code) {
          _.collapse = !coin.collapse;
        }
      });

      dispatch(syncCoinsStateAction(cloneCoins));
    } catch (error) {}
  };
}

export function toggleAllCoinsCollapseAction(): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        coin: { coins },
      } = getState();
      const cloneCoins = Utils.DeepCopy(coins);
      const expandAllCoins = coins.every((_) => _.collapse);
      cloneCoins.forEach((_) => {
        _.collapse = !expandAllCoins;
      });
      dispatch(syncCoinsStateAction(cloneCoins));
    } catch (error) {}
  };
}

export function syncCoinsStateAction(coins: (Coin.ResponseItem & Coin.ExtraRow)[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Coin.GetCoinConfig();
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

      const oldRemoteMap = remoteCoins.reduce((r, c) => {
        r[c.code] = c;
        return r;
      }, {} as Record<string, Coin.RemoteCoin>);

      const newRemoteMap = newRemoteCoins.reduce((r, c) => {
        r[c.code] = c;
        return r;
      }, {} as Record<string, Coin.RemoteCoin>);

      const remoteMap = { ...oldRemoteMap, ...newRemoteMap };

      await Utils.SetStorage(CONST.STORAGE.REMOTE_COIN_MAP, remoteMap);

      dispatch(setRemoteCoins(Object.values(remoteMap)));
    } catch (error) {}
  };
}
