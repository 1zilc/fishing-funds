import { batch } from 'react-redux';
import { store } from '@/.';
import { sortZindexsCachedAction, SET_ZINDEXS_LOADING } from '@/actions/zindex';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

const { got } = window.contextModules;

export interface CodeZindexMap {
  [index: string]: Zindex.SettingItem & { originSort: number };
}

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
  }, {} as CodeZindexMap);
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

export async function GetRemoteZindexConfig() {
  const cb = 'parsezindex';
  const now = new Date().getTime();
  const fields = '12,13,14';
  const { body: b1 } = await got(
    `http://32.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=50&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=&fs=b:MK0010`,
    {
      searchParams: {
        cb,
        fields,
        _: now,
      },
    }
  );
  const a1 = eval(b1);
  const { body: b2 } = await got(
    `http://32.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=5&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:1+t:1`,
    {
      searchParams: {
        cb,
        fields,
        _: now,
      },
    }
  );
  const a2 = eval(b2);
  const { body: b3 } = await got(
    `http://32.push2.eastmoney.com/api/qt/clist/get?&pn=1&pz=5&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:5`,
    {
      searchParams: {
        cb,
        fields,
        _: now,
      },
    }
  );
  const a3 = eval(b3);
  const result = [...a1, ...a2, ...a3];
  return result;
}

export async function LoadZindexs(loading: boolean) {
  try {
    store.dispatch({ type: SET_ZINDEXS_LOADING, payload: loading && true });
    const responseZindexs = (await Helpers.Zindex.GetZindexs()).filter(Utils.NotEmpty);
    batch(() => {
      store.dispatch(sortZindexsCachedAction(responseZindexs));
      store.dispatch({ type: SET_ZINDEXS_LOADING, payload: false });
    });
  } catch (error) {
    store.dispatch({ type: SET_ZINDEXS_LOADING, payload: false });
  }
}
