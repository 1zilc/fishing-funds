import { store } from '@/index';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

export interface CodeWalletMap {
  [index: string]: Wallet.SettingItem & Wallet.OriginRow;
}

export const defaultWallet: Wallet.SettingItem = {
  name: '默认钱包',
  iconIndex: 0,
  code: '-1',
  funds: [],
};

export const walletIcons = new Array(40).fill('').map((_, index) => require(`@/assets/icons/wallet/${index}.svg`).default);

export function GetCurrentWallet() {
  const walletConfig: Wallet.SettingItem[] = Utils.GetStorage(CONST.STORAGE.WALLET_SETTING, [defaultWallet]);
  const codeMap = GetCodeMap(walletConfig);
  return { walletConfig, codeMap };
}

export function GetWalletConfig(code: string) {
  const { walletConfig } = GetCurrentWallet();
  const currentWalletCode = code;
  return walletConfig.find(({ code }) => currentWalletCode === code) || defaultWallet;
}

export function GetCodeMap(config: Wallet.SettingItem[]) {
  return config.reduce<CodeWalletMap>((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {});
}

export function GetEyeStatus() {
  return Utils.GetStorage(CONST.STORAGE.EYE_STATUS, Enums.EyeStatus.Open);
}

export function GetCurrentWalletCode() {
  return Utils.GetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, defaultWallet.code);
}

export function GetCurrentWalletState() {
  const {
    wallet: { currentWalletCode },
  } = store.getState();

  return GetWalletState(currentWalletCode);
}

export function GetWalletState(walletCode: string) {
  const {
    wallet: { wallets },
  } = store.getState();

  return (
    wallets.find(({ code }) => code === walletCode) || {
      funds: [],
      updateTime: '',
      code: walletCode,
    }
  );
}
