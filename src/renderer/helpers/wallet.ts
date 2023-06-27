import { defaultWallet } from '@/store/features/wallet';
import * as Utils from '@/utils';

export const walletIcons = new Array(40).fill('').map((_, index) => Utils.ImportStatic(`wallet/${index}.png`));

export function GetCurrentWalletState(walletCode: string, wallets: Wallet.StateItem[]) {
  return wallets.find(({ code }) => code === walletCode) || { code: walletCode, funds: [], updateTime: '' };
}

export function GetCurrentWalletConfig(walletCode: string, walletsConfig: Wallet.SettingItem[]) {
  return walletsConfig.find(({ code }) => code === walletCode) || defaultWallet;
}
