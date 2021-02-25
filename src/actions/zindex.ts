import got from 'got';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import CONST_STORAGE from '@/constants/storage.json';

export const SET_ZINDEXS = 'SET_ZINDEXS';
export const TOGGLE_ZINDEX_COLLAPSE = 'TOGGLE_ZINDEX_COLLAPSE';
export const TOGGLE_ZINDEXS_COLLAPSE = 'TOGGLE_ZINDEXS_COLLAPSE';
export const SORT_ZINDEXS = 'SORT_ZINDEXS';
export const SORT_ZINDEXS_WITH_COLLAPSE_CHACHED =
  'SORT_ZINDEXS_WITH_COLLAPSE_CHACHED';
export interface CodeMap {
  [index: string]: Zindex.SettingItem & { originSort: number };
}

export const defaultZindexConfig = [
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
];

export function getZindexConfig() {
  const zindexConfig: Zindex.SettingItem[] = Utils.GetStorage(
    CONST_STORAGE.ZINDEX_SETTING,
    defaultZindexConfig
  );
  const codeMap = zindexConfig.reduce((r, c, i) => {
    r[c.code.slice(2)] = { ...c, originSort: i };
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
    .map(({ code }) => () => getZindex(code));
  await Utils.Sleep(1000);
  return Adapter.ConCurrencyAllAdapter<Zindex.ResponseItem>(collectors);
}

export async function getZindex(code: string) {
  return Services.Zindex.FromEastmoney(code);
}

export async function saveZindexConfig(zindexConfig: Zindex.SettingItem[]) {
  Utils.SetStorage(CONST_STORAGE.ZINDEX_SETTING, zindexConfig);
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
