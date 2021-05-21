import { batch } from 'react-redux';

import { Dispatch, GetState } from '@/reducers/types';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

const got = window.contextModules.got;

export const SET_ZINDEXS = 'SET_ZINDEXS';
export const SET_ZINDEXS_LOADING = 'SET_ZINDEXS_LOADING';
export const TOGGLE_ZINDEX_COLLAPSE = 'TOGGLE_ZINDEX_COLLAPSE';
export const TOGGLE_ZINDEXS_COLLAPSE = 'TOGGLE_ZINDEXS_COLLAPSE';
export const SORT_ZINDEXS = 'SORT_ZINDEXS';
export const SORT_ZINDEXS_WITH_COLLAPSE_CHACHED =
  'SORT_ZINDEXS_WITH_COLLAPSE_CHACHED';
export interface CodeMap {
  [index: string]: Zindex.SettingItem & { originSort: number };
}

export const defaultZindexConfig = [
  // 沪深指数
  { name: '上证指数', code: '1.000001', show: true },
  { name: '深证成指', code: '0.399001', show: true },
  { name: '沪深300', code: '1.000300', show: true },
  { name: '中小板指', code: '0.399005', show: true },
  { name: '创业板指', code: '0.399006', show: true },
  { name: '上证180', code: '1.000010', show: false },
  { name: '上证50', code: '1.000016', show: true },
  { name: '上证380', code: '1.000009', show: false },
  { name: '上证100', code: '1.000132', show: false },
  { name: '上证150', code: '1.000133', show: false },
  { name: 'Ｂ股指数', code: '1.000003', show: false },
  { name: '国债指数', code: '1.000012', show: false },
  { name: '企债指数', code: '1.000013', show: false },
  { name: '基金指数', code: '1.000011', show: false },
  { name: '深成指R', code: '0.399002', show: false },
  { name: '成份Ｂ指', code: '0.399003', show: false },
  { name: '深证综指', code: '0.399106', show: false },
  { name: '深证100R', code: '0.399004', show: false },
  { name: '深证300', code: '0.399007', show: false },
  { name: '中小300', code: '0.399008', show: false },
  { name: '创业大盘', code: '0.399293', show: false },
  { name: '新 指 数', code: '0.399100', show: false },
  { name: '央视50', code: '0.399550', show: false },
  { name: '中证500', code: '1.000905', show: true },
  { name: '中证100', code: '1.000903', show: false },
  { name: '中证800', code: '1.000906', show: false },
  { name: '科创50', code: '1.000688', show: false },
  { name: '上证银行', code: '1.000134', show: false },
  { name: '内地银行', code: '1.000947', show: false },
  { name: '300医药', code: '1.000913', show: false },
  { name: '300银行', code: '1.000951', show: false },
  { name: '300地产', code: '1.000952', show: false },
  { name: '中证银行', code: '0.399986', show: false },
  { name: '国证银行', code: '0.399431', show: false },
  { name: '深成地产', code: '0.971001', show: false },
  { name: '深成地产R', code: '0.471001', show: false },
  { name: '300 医药', code: '0.399913', show: false },
  // 美洲股市
  { name: '道琼斯', code: '100.DJIA', show: true },
  { name: '标普500', code: '100.SPX', show: true },
  { name: '纳斯达克', code: '100.NDX', show: true },
  { name: '加拿大S&P/TSX', code: '100.TSX', show: false },
  { name: '巴西BOVESPA', code: '100.BVSP', show: false },
  { name: '墨西哥BOLSA', code: '100.MXX', show: false },
  // 亚洲股市
  { name: '台湾加权', code: '100.TWII', show: false },
  { name: '富时新加坡海峡时报', code: '100.STI', show: false },
  { name: '泰国SET', code: '100.SET', show: false },
  { name: '斯里兰卡科伦坡', code: '100.CSEALL', show: false },
  { name: '韩国KOSPI', code: '100.KS11', show: false },
  { name: '富时马来西亚KLCI', code: '100.KLSE', show: false },
  { name: '印度孟买SENSEX', code: '100.SENSEX', show: false },
  { name: '巴基斯坦卡拉奇', code: '100.KSE100', show: false },
  { name: '韩国KOSPI200', code: '100.KOSPI200', show: false },
  { name: '红筹指数', code: '124.HSCCI', show: false },
  { name: '日经225', code: '100.N225', show: false },
  { name: '恒生指数', code: '100.HSI', show: false },
  { name: '菲律宾马尼拉', code: '100.PSI', show: false },
  { name: '国企指数', code: '100.HSCEI', show: false },
  { name: '印尼雅加达综合', code: '100.JKSE', show: false },
  { name: '越南胡志明', code: '100.VNINDEX', show: false },
  // 欧洲股市
  { name: '波兰WIG', code: '100.WIG', show: false },
  { name: '俄罗斯RTS', code: '100.RTS', show: false },
  { name: 'OMX哥本哈根20', code: '100.OMXC20', show: false },
  { name: '挪威OSEBX', code: '100.OSEBX', show: false },
  { name: '德国DAX30', code: '100.GDAXI', show: false },
  { name: '芬兰赫尔辛基', code: '100.HEX', show: false },
  { name: '英国富时250', code: '100.MCX', show: false },
  { name: '布拉格指数', code: '100.PX', show: false },
  { name: '葡萄牙PSI20', code: '100.PSI20', show: false },
  { name: '欧洲斯托克50', code: '100.SX5E', show: false },
  { name: '西班牙IBEX35', code: '100.IBEX', show: false },
  { name: '荷兰AEX', code: '100.AEX', show: false },
  { name: '富时AIM全股', code: '100.AXX', show: false },
  { name: '英国富时100', code: '100.FTSE', show: false },
  { name: '比利时BFX', code: '100.BFX', show: false },
  { name: '奥地利ATX', code: '100.ATX', show: false },
  { name: '瑞典OMXSPI', code: '100.OMXSPI', show: false },
  { name: '瑞士SMI', code: '100.SSMI', show: false },
  { name: '富时意大利MIB', code: '100.MIB', show: false },
  { name: '法国CAC40', code: '100.FCHI', show: false },
  { name: '爱尔兰综合', code: '100.ISEQ', show: false },
  { name: '冰岛ICEX', code: '100.ICEX', show: false },
  { name: '希腊雅典ASE', code: '100.ASE', show: false },
  // 澳洲股市
  { name: '澳大利亚标普200', code: '100.AS51', show: false },
  { name: '澳大利亚普通股', code: '100.AORD', show: false },
  { name: '新西兰50', code: '100.NZ50', show: false },
  // 其他指数
  { name: '路透CRB商品指数', code: '100.CRB', show: false },
  { name: '美元指数', code: '100.UDI', show: false },
  { name: '波罗的海BDI指数', code: '100.BDI', show: false },
];

export function getZindexConfig() {
  const zindexConfig: Zindex.SettingItem[] = Utils.GetStorage(
    CONST.STORAGE.ZINDEX_SETTING,
    defaultZindexConfig
  );
  const _codeMap = zindexConfig.reduce((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {} as CodeMap);

  defaultZindexConfig.forEach((config) => {
    if (!_codeMap[config.code]) {
      zindexConfig.push(config);
    }
  });

  const codeMap = zindexConfig.reduce((r, c, i) => {
    const code = c.code.split('.')?.[1];
    r[code] = { ...c, originSort: i };
    return r;
  }, {} as CodeMap);

  const selectZindexs = zindexConfig
    .filter(({ show }) => show)
    .map(({ code }) => code);

  return { zindexConfig, codeMap, selectZindexs };
}

export async function getZindexs() {
  const { zindexConfig } = getZindexConfig();
  const collectors = zindexConfig
    .filter(({ show }) => show)
    .map(
      ({ code }) =>
        () =>
          getZindex(code)
    );
  return Adapter.ChokeGroupAdapter<Zindex.ResponseItem>(collectors, 5, 500);
}

export async function getZindex(code: string) {
  return Services.Zindex.FromEastmoney(code);
}

export async function saveZindexConfig(zindexConfig: Zindex.SettingItem[]) {
  Utils.SetStorage(CONST.STORAGE.ZINDEX_SETTING, zindexConfig);
}

export function loadZindexs() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_ZINDEXS_LOADING, payload: true });
      const zindexs = await getZindexs();
      batch(() => {
        dispatch({
          type: SORT_ZINDEXS_WITH_COLLAPSE_CHACHED,
          payload: zindexs,
        });
        dispatch({ type: SET_ZINDEXS_LOADING, payload: false });
      });
    } catch {
      dispatch({ type: SET_ZINDEXS_LOADING, payload: false });
    }
  };
}

export function loadZindexsWithoutLoading() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const zindexs = await getZindexs();
      batch(() => {
        dispatch({
          type: SORT_ZINDEXS_WITH_COLLAPSE_CHACHED,
          payload: zindexs,
        });
      });
    } finally {
    }
  };
}

export async function getRemoteZindexConfig() {
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
