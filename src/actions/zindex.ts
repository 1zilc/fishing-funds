import * as Adapter from '../utils/adpters';
import * as Services from '../services';
import * as Utils from '../utils';

const zindexs: Zindex.SettingItem[] = [
  { code: '1.000001' },
  { code: '0.399001' },
  { code: '0.399006' },
  { code: '1.000300' },
  { code: '0.399005' },
  { code: '1.000016' },
  { code: '1.000905' },
];
export const getZindexs: () => Promise<
  (Zindex.ResponseItem | null)[]
> = async () => {
  const collectors = zindexs.map(({ code }) => () => getZindex(code));
  await Utils.Sleep(1000);
  return Adapter.ConCurrencyAllAdapter<Zindex.ResponseItem>(collectors);
};

export const getZindex: (
  code: string
) => Promise<Zindex.ResponseItem | null> = async (code) => {
  return Services.Zindex.FromEastmoney(code);
};
