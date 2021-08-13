import { batch } from 'react-redux';

import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_COINS_LOADING = 'SET_COINS_LOADING';
export const SYNC_COINS = 'SYNC_COINS';
export const SYNC_COINS_CONFIG = 'SYNC_COINS_CONFIG';

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
    } catch (error) {
      console.log('添加货币配置出错', error);
    }
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
    } catch (error) {
      console.log('删除货币出错', error);
    }
  };
}

export function setCoinConfigAction(coinConfig: Coin.SettingItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        coin: { coins },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.STOCK_SETTING, coinConfig);
      batch(() => {
        dispatch(syncCoinConfigAction());
        dispatch(syncCoinsStateAction(coins));
      });
    } catch (error) {
      console.log('设置货币配置出错', error);
    }
  };
}

export function syncCoinConfigAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const config = Helpers.Coin.GetCoinConfig();
      dispatch({ type: SYNC_COINS_CONFIG, payload: config });
    } catch (error) {
      console.log('同步货币配置失败', error);
    }
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
    } catch (error) {
      console.log('货币排序错误', error);
    }
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
    } catch (error) {
      console.log('货币带缓存排序出错', error);
    }
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
    } catch (error) {
      console.log('货币展开/折叠出错', error);
    }
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
    } catch (error) {
      console.log('全部货币展开/折叠出错', error);
    }
  };
}

export function syncCoinsStateAction(coins: (Coin.ResponseItem & Coin.ExtraRow)[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Coin.GetCoinConfig();
      const filterCoins = coins.filter(({ code }) => codeMap[code]);
      dispatch({ type: SYNC_COINS, payload: filterCoins });
    } catch (error) {
      console.log('同步货币状态出错', error);
    }
  };
}
