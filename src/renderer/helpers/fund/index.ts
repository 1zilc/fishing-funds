import { defaultWallet } from '@/store/features/wallet';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Adapter from '@/utils/adpters';

export * from './utils';

export function GetFundConfig(walletCode: string, walletsConfig: Wallet.SettingItem[]) {
  const walletConfig = walletsConfig.find(({ code }) => code === walletCode) || defaultWallet;
  const fundConfig = walletConfig.funds;
  const codeMap = Utils.GetCodeMap(fundConfig, 'code');
  return { fundConfig, codeMap };
}

export function GetFundConfigMaps(codes: string[], walletsConfig: Wallet.SettingItem[]) {
  return codes.map((code) => GetFundConfig(code, walletsConfig).codeMap);
}

export async function GetFixFunds(funds: (Fund.ResponseItem & Fund.FixData)[]) {
  const collectors = funds
    .filter(({ fixDate, gztime }) => !fixDate || fixDate !== gztime?.slice(5, 10))
    .map(
      ({ fundcode }) =>
        () =>
          Services.Fund.GetFixFromEastMoney(fundcode!)
    );
  const list = await Adapter.ChokeGroupAdapter(collectors, 3, 500);
  return list.filter(Utils.NotEmpty);
}

export async function GetFunds(config: Fund.SettingItem[], fundApiTypeSetting: Enums.FundApiType) {
  const collectors = config.map(
    ({ code }) =>
      () =>
        GetFund(code, fundApiTypeSetting)
  );
  const load = () => {
    switch (fundApiTypeSetting) {
      case Enums.FundApiType.Dayfund:
        return Adapter.ChokeGroupAdapter(collectors, 1, 100);
      case Enums.FundApiType.Tencent:
        return Adapter.ChokeGroupAdapter(collectors, 3, 300);
      case Enums.FundApiType.Sina:
        return Adapter.ChokeGroupAdapter(collectors, 3, 300);
      case Enums.FundApiType.Howbuy:
        return Adapter.ChokeGroupAdapter(collectors, 3, 300);
      case Enums.FundApiType.Etf:
        return Adapter.ChokeGroupAdapter(collectors, 3, 300);
      case Enums.FundApiType.Ant:
        return Adapter.ChokeGroupAdapter(collectors, 4, 400);
      case Enums.FundApiType.Fund10jqka:
        return Adapter.ChokeGroupAdapter(collectors, 5, 500);
      case Enums.FundApiType.Eastmoney:
      default:
        return Adapter.ChokeGroupAdapter(collectors, 5, 500);
    }
  };
  const list = await load();

  return list.filter(Utils.NotEmpty);
}

export async function GetFund(code: string, fundApiTypeSetting: Enums.FundApiType) {
  switch (fundApiTypeSetting) {
    case Enums.FundApiType.Dayfund:
      return Services.Fund.FromDayFund(code);
    case Enums.FundApiType.Tencent:
      return Services.Fund.FromTencent(code);
    case Enums.FundApiType.Sina:
      return Services.Fund.FromSina(code);
    case Enums.FundApiType.Howbuy:
      return Services.Fund.FromHowbuy(code);
    case Enums.FundApiType.Etf:
      return Services.Fund.FromEtf(code);
    case Enums.FundApiType.Ant:
      return Services.Fund.FromFund123(code);
    case Enums.FundApiType.Fund10jqka:
      return Services.Fund.FromFund10jqka(code);
    case Enums.FundApiType.Eastmoney:
    default:
      // 默认请求天天基金
      return Services.Fund.FromEastmoney(code);
  }
}
