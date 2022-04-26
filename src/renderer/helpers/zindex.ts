import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';

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

export async function GetZindexs(config: Zindex.SettingItem[]) {
  const collectors = config.map(
    ({ code }) =>
      () =>
        GetZindex(code)
  );
  const list = await Adapter.ChokeGroupAdapter<Zindex.ResponseItem>(collectors, 5, 500);
  return list.filter(Utils.NotEmpty);
}

export async function GetZindex(code: string) {
  return Services.Zindex.FromEastmoney(code);
}
