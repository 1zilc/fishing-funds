import * as Helpers from '@/helpers';

export const defaultWallet: Wallet.SettingItem = {
  name: '默认钱包',
  iconIndex: 0,
  code: '-1',
  funds: [],
};

export const walletIcons = new Array(40).fill('').map((_, index) => require(`@assets/wallet/${index}.png`));

export function GetCurrentWalletState(walletCode: string, wallets: Wallet.StateItem[]) {
  return wallets.find(({ code }) => code === walletCode) || { code: '', funds: [], updateTime: '' };
}
export function GetCurrentWalletConfig(walletCode: string, walletsConfig: Wallet.SettingItem[]) {
  return walletsConfig.find(({ code }) => code === walletCode) || Helpers.Wallet.defaultWallet;
}
