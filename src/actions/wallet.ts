import { GetState, Dispatch } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';

export const UPDATE_UPTATETIME = 'UPDATE_UPTATETIME';
export const CHANGE_EYE_STATUS = 'CHANGE_EYE_STATUS';
export const CHANGE_CURRENT_WALLET_CODE = 'CHANGE_CURRENT_WALLET_CODE';

export interface NameMap {
  [index: string]: Wallet.SettingItem & Wallet.OriginRow;
}
export const defaultWallet: Wallet.SettingItem = {
  name: '默认钱包',
  iconIndex: 0,
  code: '-1',
  funds: [],
};

export function updateUpdateTime(updateTime: string) {
  return {
    type: UPDATE_UPTATETIME,
    payload: updateTime,
  };
}

export function changeEyeStatus(status: Enums.EyeStatus) {
  Utils.SetStorage(CONST.STORAGE.EYE_STATUS, status);
  return {
    type: CHANGE_EYE_STATUS,
    payload: status,
  };
}

export function toggleEyeStatus() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { wallet } = getState();
    const { eyeStatus } = wallet;
    switch (eyeStatus) {
      case Enums.EyeStatus.Open:
        dispatch(changeEyeStatus(Enums.EyeStatus.Close));
        break;
      case Enums.EyeStatus.Close:
        dispatch(changeEyeStatus(Enums.EyeStatus.Open));
        break;
      default:
    }
  };
}

export function getWalletConfig() {
  const walletConfig: Wallet.SettingItem[] = Utils.GetStorage(
    CONST.STORAGE.WALLET_SETTING,
    [defaultWallet]
  );
  const codeMap = getCodeMap(walletConfig);
  return { walletConfig, codeMap };
}

export function getCurrentWallet(code?: string) {
  const { walletConfig } = getWalletConfig();
  const currentWalletCode =
    code ||
    Utils.GetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, defaultWallet.code);
  return (
    walletConfig.filter(({ code }) => currentWalletCode === code)[0] ||
    defaultWallet
  );
}

export function setWalletConfig(config: Wallet.SettingItem[]) {
  Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, config);
}

export function getCodeMap(config: Wallet.SettingItem[]) {
  return config.reduce<NameMap>((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {});
}

export function addWallet(wallet: Wallet.SettingItem) {
  const { walletConfig } = getWalletConfig();
  Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, [...walletConfig, wallet]);
}

export function updateWallet(wallet: Wallet.SettingItem) {
  const { walletConfig } = getWalletConfig();
  walletConfig.forEach((item) => {
    if (wallet.code === item.code) {
      item.name = wallet.name;
      item.iconIndex = wallet.iconIndex;
    }
  });
  Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, walletConfig);
}

export function selectWallet(code: string) {
  Utils.SetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, code);
  return {
    type: CHANGE_CURRENT_WALLET_CODE,
    payload: code,
  };
}

export function deleteWallet(code: string) {
  const { walletConfig } = getWalletConfig();
  walletConfig.forEach((item, index) => {
    if (code === item.code) {
      const cloneWalletSetting = JSON.parse(JSON.stringify(walletConfig));
      cloneWalletSetting.splice(index, 1);
      Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, cloneWalletSetting);
    }
  });
}
