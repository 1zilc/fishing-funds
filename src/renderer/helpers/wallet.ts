import { defaultWallet } from '@/store/features/wallet';

export const walletIcons = new Array(40).fill('').map((_, index) => '');

export function GetCurrentWalletState(walletCode: string, wallets: Wallet.StateItem[]) {
  return wallets.find(({ code }) => code === walletCode) || { code: walletCode, funds: [], updateTime: '' };
}

export function GetCurrentWalletConfig(walletCode: string, walletsConfig: Wallet.SettingItem[]) {
  return walletsConfig.find(({ code }) => code === walletCode) || defaultWallet;
}
