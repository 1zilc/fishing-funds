import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';

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
