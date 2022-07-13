import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export async function GetCoin(code: string) {
  return Services.Coin.GetDetailFromCoingecko(code);
}
export async function GetCoins(config: Coin.SettingItem[], unit: Enums.CoinUnitType) {
  const ids = config.map(({ code }) => code).join(',');
  const list = await Services.Coin.FromCoingecko(ids, unit);
  return list.filter(Utils.NotEmpty);
}

export function MergeStateCoins(
  config: Coin.SettingItem[],
  oldCoins: (Coin.ResponseItem & Coin.ExtraRow)[],
  newCoins: Coin.ResponseItem[]
) {
  const oldCoinsCodeToMap = Utils.GetCodeMap(oldCoins, 'code');
  const newCoinsCodeToMap = Utils.GetCodeMap(newCoins, 'code');

  const coinsWithChachedCodeToMap = config.reduce((map, { code }) => {
    const oldFund = oldCoinsCodeToMap[code];
    const newFund = newCoinsCodeToMap[code];
    if (oldFund || newFund) {
      map[code] = { ...(oldFund || {}), ...(newFund || {}) };
    }
    return map;
  }, {} as Record<string, Coin.ResponseItem & Coin.ExtraRow>);

  const coinsWithChached = Object.values(coinsWithChachedCodeToMap);

  return coinsWithChached;
}
