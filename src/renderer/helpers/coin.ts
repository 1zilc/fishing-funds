import { batch } from 'react-redux';
import { store } from '@/.';
import { sortCoinsCachedAction, setRemoteCoinsAction, SET_COINS_LOADING, SET_REMOTE_COINS_LOADING } from '@/actions/coin';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export interface CodeCoinMap {
  [index: string]: Coin.SettingItem & { originSort: number };
}

export function GetCoinConfig() {
  const coinConfig: Coin.SettingItem[] = Utils.GetStorage(CONST.STORAGE.COIN_SETTING, []);
  const codeMap = coinConfig.reduce((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {} as CodeCoinMap);

  return { coinConfig, codeMap };
}
export async function GetCoins(config?: Coin.SettingItem[]) {
  const { coinConfig } = GetCoinConfig();
  const { coinUnitSetting } = Helpers.Setting.GetSystemSetting();
  const ids = (config || coinConfig).map(({ code }) => code).join(',');
  return Services.Coin.FromCoingecko(ids, coinUnitSetting);
}

export async function GetCoin(code: string) {
  return Services.Coin.GetDetailFromCoingecko(code);
}

export function SortCoins(responseCoins: Coin.ResponseItem[]) {
  const {
    coinSortMode: { type: coinSortType, order: coinSortorder },
  } = Helpers.Sort.GetSortMode();
  const { codeMap } = GetCoinConfig();
  const sortList = Utils.DeepCopy(responseCoins);

  sortList.sort((a, b) => {
    const t = coinSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (coinSortType) {
      case Enums.CoinSortType.Price:
        return (Number(a.price) - Number(b.price)) * t;
      case Enums.CoinSortType.Zdf:
        return (Number(a.change24h) - Number(b.change24h)) * t;
      case Enums.CoinSortType.Volum:
        return (Number(a.vol24h) - Number(b.vol24h)) * t;
      case Enums.CoinSortType.Custom:
      default:
        return (codeMap[b.code!]?.originSort - codeMap[a.code!]?.originSort) * t;
    }
  });

  return sortList;
}

export async function LoadCoins(loading: boolean) {
  try {
    store.dispatch({ type: SET_COINS_LOADING, payload: loading && true });
    const responseCoins = (await GetCoins()).filter(Utils.NotEmpty) as Coin.ResponseItem[];
    batch(() => {
      store.dispatch(sortCoinsCachedAction(responseCoins));
      store.dispatch({ type: SET_COINS_LOADING, payload: false });
    });
  } catch (error) {
    console.log('加载货币失败', error);
    store.dispatch({ type: SET_COINS_LOADING, payload: false });
  }
}

export async function LoadRemoteCoins() {
  try {
    store.dispatch({ type: SET_REMOTE_COINS_LOADING, payload: true });
    const remoteCoins = await Services.Coin.GetRemoteCoinsFromCoingecko();
    batch(() => {
      store.dispatch(setRemoteCoinsAction(remoteCoins));
      store.dispatch({ type: SET_REMOTE_COINS_LOADING, payload: false });
    });
  } catch (error) {
    console.log('加载远程货币库出错', error);
    store.dispatch({ type: SET_REMOTE_COINS_LOADING, payload: false });
  }
}

export function GetRemoteCoins() {
  return Object.entries(Utils.GetStorage<Record<string, Coin.RemoteCoin>>(CONST.STORAGE.REMOTE_COIN_MAP, {})).map(
    ([code, remoteCoin]) => remoteCoin
  );
}

export function GetRemoteCoinsMap() {
  return Utils.GetStorage<Record<string, Coin.RemoteCoin>>(CONST.STORAGE.REMOTE_COIN_MAP, {});
}

export function GetCurrentCoin(code: string) {
  const remoteCoinsMap = GetRemoteCoinsMap();
  return remoteCoinsMap[code];
}
