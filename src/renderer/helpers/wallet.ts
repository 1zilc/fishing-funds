import NP from 'number-precision';
import { defaultWallet } from '@/store/features/wallet';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export const walletIcons = new Array(40).fill('').map((_, index) => Utils.ImportStatic(`wallet/${index}.png`));

export function GetCurrentWalletState(walletCode: string, wallets: Wallet.StateItem[]) {
  return (
    wallets.find(({ code }) => code === walletCode) || {
      code: walletCode,
      funds: [],
      stocks: [],
      updateTime: '',
    }
  );
}

export function GetCurrentWalletConfig(walletCode: string, walletsConfig: Wallet.SettingItem[]) {
  return walletsConfig.find(({ code }) => code === walletCode) || defaultWallet;
}

export function CalcWallet(option: { wallets: Wallet.StateItem[]; walletConfig: Wallet.SettingItem[]; code: string }) {
  const { wallets, walletConfig, code } = option;
  const { funds, stocks } = Helpers.Wallet.GetCurrentWalletState(code, wallets);
  const { codeMap: fundConfigCodeMap } = Helpers.Fund.GetFundConfig(code, walletConfig);
  const { codeMap: stockConfigCodeMap } = Helpers.Stock.GetStockConfig(code, walletConfig);
  const calcFundResult = Helpers.Fund.CalcFunds(funds, fundConfigCodeMap);
  const calcStockResult = Helpers.Stock.CalcStocks(stocks, stockConfigCodeMap);
  const zje = NP.plus(calcFundResult.zje, calcStockResult.zje);
  const sygz = NP.plus(calcFundResult.sygz, calcStockResult.sygz);
  const gszje = NP.plus(calcFundResult.gszje, calcStockResult.gszje);
  const gssyl = zje ? NP.times(NP.divide(sygz, zje), 100) : 0;

  return {
    zje, // 总金额
    sygz, // 收益估值
    gszje, // 估算总金额
    gssyl, // 估算收益率
    calcFundResult,
    calcStockResult,
  };
}
