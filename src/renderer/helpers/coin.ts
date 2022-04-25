import { batch } from 'react-redux';
import store from '@/store';
import { setCoinsLoading, setRemoteCoinsLoading } from '@/store/features/coin';
import { sortCoinsCachedAction, setRemoteCoinsAction } from '@/actions/coin';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export function GetCoinConfig() {
  const {
    coin: {
      config: { coinConfig },
    },
  } = store.getState();
  const codeMap = GetCodeMap(coinConfig);
  return { coinConfig, codeMap };
}

export function GetCodeMap(config: Coin.SettingItem[]) {
  return config.reduce((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {} as Coin.CodeMap);
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
    sort: {
      sortMode: {
        coinSortMode: { type: coinSortType, order: coinSortorder },
      },
    },
  } = store.getState();

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
      case Enums.CoinSortType.Name:
        return b.code.localeCompare(a.code, 'zh') * t;
      case Enums.CoinSortType.Custom:
      default:
        return (codeMap[b.code!]?.originSort - codeMap[a.code!]?.originSort) * t;
    }
  });

  return sortList;
}

export async function LoadCoins(loading: boolean) {
  try {
    store.dispatch(setCoinsLoading(loading));
    const responseCoins = (await GetCoins()).filter(Utils.NotEmpty) as Coin.ResponseItem[];
    batch(() => {
      store.dispatch(sortCoinsCachedAction(responseCoins));
      store.dispatch(setCoinsLoading(false));
    });
  } catch (error) {
    store.dispatch(setCoinsLoading(false));
  }
}

export async function LoadRemoteCoins() {
  try {
    store.dispatch(setRemoteCoinsLoading(true));
    const remoteCoins = await Services.Coin.GetRemoteCoinsFromCoingecko();
    batch(() => {
      store.dispatch(setRemoteCoinsAction(remoteCoins));
      store.dispatch(setRemoteCoinsLoading(false));
    });
  } catch (error) {
    store.dispatch(setRemoteCoinsLoading(false));
  }
}

export function GetCurrentCoin(code: string) {
  const {
    coin: { remoteCoins },
  } = store.getState();

  return remoteCoins.reduce((m, c) => {
    m[c.code] = c;
    return m;
  }, {} as Record<string, Coin.RemoteCoin>)[code];
}
