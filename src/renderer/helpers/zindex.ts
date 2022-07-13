import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';

export async function GetZindexs(config: Zindex.SettingItem[]) {
  const collectors = config.map(
    ({ code }) =>
      () =>
        GetZindex(code)
  );
  const list = await Adapter.ChokeGroupAdapter(collectors, 5, 500);
  return list.filter(Utils.NotEmpty);
}

export async function GetZindex(code: string) {
  return Services.Zindex.FromEastmoney(code);
}

export function MergeStateZindexs(
  config: Zindex.SettingItem[],
  oldZindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[],
  newZindexs: Zindex.ResponseItem[]
) {
  const oldZindexsCodeToMap = Utils.GetCodeMap(oldZindexs, 'code');
  const newZindexsCodeToMap = Utils.GetCodeMap(newZindexs, 'code');

  const zindexsWithChachedCodeToMap = config.reduce((map, { code }) => {
    const oldFund = oldZindexsCodeToMap[code];
    const newFund = newZindexsCodeToMap[code];
    if (oldFund || newFund) {
      map[code] = { ...(oldFund || {}), ...(newFund || {}) };
    }
    return map;
  }, {} as Record<string, Zindex.ResponseItem & Zindex.ExtraRow>);

  const zindexsWithChached = Object.values(zindexsWithChachedCodeToMap);

  return zindexsWithChached;
}
