import { batch } from 'react-redux';
import store from '@/store';
import { setZindexesLoading } from '@/store/features/zindex';
import { sortZindexsCachedAction } from '@/actions/zindex';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export const defaultZindexConfig = [
  // 沪深指数
  { name: '上证指数', code: '1.000001' },
  { name: '深证成指', code: '0.399001' },
  { name: '科创50', code: '1.000688' },
  { name: '沪深300', code: '1.000300' },
  { name: '创业板指', code: '0.399006' },
  // 美洲股市
  { name: '道琼斯', code: '100.DJIA' },
  { name: '标普500', code: '100.SPX' },
  { name: '纳斯达克', code: '100.NDX' },
];

export function GetZindexConfig() {
  const {
    zindex: {
      config: { zindexConfig },
    },
  } = store.getState();
  const codeMap = GetCodeMap(zindexConfig);
  return { zindexConfig, codeMap };
}

export function GetCodeMap(config: Zindex.SettingItem[]) {
  return config.reduce((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {} as Zindex.CodeMap);
}

export async function GetZindexs() {
  const { zindexConfig } = GetZindexConfig();
  const collectors = zindexConfig.map(
    ({ code }) =>
      () =>
        GetZindex(code)
  );
  return Adapter.ChokeGroupAdapter<Zindex.ResponseItem>(collectors, 5, 500);
}

export async function GetZindex(code: string) {
  return Services.Zindex.FromEastmoney(code);
}

export function SortZindexs(responseZindexs: Zindex.ResponseItem[]) {
  const {
    sort: {
      sortMode: {
        zindexSortMode: { type: zindexSortType, order: zindexSortorder },
      },
    },
  } = store.getState();

  const { codeMap } = GetZindexConfig();
  const sortList = Utils.DeepCopy(responseZindexs);

  sortList.sort((a, b) => {
    const t = zindexSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (zindexSortType) {
      case Enums.ZindexSortType.Zdd:
        return (a.zdd - b.zdd) * t;
      case Enums.ZindexSortType.Zdf:
        return (a.zdf - b.zdf) * t;
      case Enums.ZindexSortType.Zsz:
        return (a.zsz - b.zsz) * t;
      case Enums.ZindexSortType.Name:
        return b.name.localeCompare(a.name, 'zh') * t;
      case Enums.ZindexSortType.Custom:
      default:
        return (codeMap[b.code]?.originSort - codeMap[a.code]?.originSort) * t;
    }
  });

  return sortList;
}

export async function LoadZindexs(loading: boolean) {
  try {
    store.dispatch(setZindexesLoading(loading));
    const responseZindexs = (await Helpers.Zindex.GetZindexs()).filter(Utils.NotEmpty);
    batch(() => {
      store.dispatch(sortZindexsCachedAction(responseZindexs));
      store.dispatch(setZindexesLoading(false));
    });
  } catch (error) {
    store.dispatch(setZindexesLoading(false));
  }
}
