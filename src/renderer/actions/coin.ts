import { batch } from 'react-redux';

import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_COINS_LOADING = 'SET_COINS_LOADING';
export const SYNC_COINS = 'SYNC_COINS';
export const SYNC_COINS_CONFIG = 'SYNC_COINS_CONFIG';
export const SET_REMOTE_COINS_LOADING = 'SET_REMOTE_COINS_LOADING';
export const SET_REMOTE_COINS = 'SET_REMOTE_COINS';

export function addCoinAction(coin: Coin.SettingItem): ThunkAction {
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

export function deleteCoinAction(code: string): ThunkAction {
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

export function setCoinConfigAction(coinConfig: Coin.SettingItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        coin: { coins },
      } = getState();
      const codeMap = Helpers.Coin.GetCodeMap(coinConfig);

      batch(() => {
        dispatch({ type: SYNC_COINS_CONFIG, payload: { coinConfig, codeMap } });
        dispatch(syncCoinsStateAction(coins));
      });

      Utils.SetStorage(CONST.STORAGE.COIN_SETTING, coinConfig);
    } catch (error) {}
  };
}

export function sortCoinsAction(): ThunkAction {
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

export function sortCoinsCachedAction(responseCoins: Coin.ResponseItem[]): ThunkAction {
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

export function toggleCoinCollapseAction(coin: Coin.ResponseItem & Coin.ExtraRow): ThunkAction {
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

export function toggleAllCoinsCollapseAction(): ThunkAction {
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

export function syncCoinsStateAction(coins: (Coin.ResponseItem & Coin.ExtraRow)[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Coin.GetCoinConfig();
      const filterCoins = coins.filter(({ code }) => codeMap[code]);
      dispatch({ type: SYNC_COINS, payload: filterCoins });
    } catch (error) {}
  };
}

export function setRemoteCoinsAction(newRemoteCoins: Coin.RemoteCoin[]): ThunkAction {
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

      dispatch({ type: SET_REMOTE_COINS, payload: Object.values(remoteMap) });

      Utils.SetStorage(CONST.STORAGE.REMOTE_COIN_MAP, remoteMap);
    } catch (error) {}
  };
}
