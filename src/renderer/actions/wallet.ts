import { GetState, Dispatch } from '@/reducers/types';
import dayjs from 'dayjs';

import { getFunds } from '@/actions/fund';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
export const CHANGE_EYE_STATUS = 'CHANGE_EYE_STATUS';
export const CHANGE_CURRENT_WALLET_CODE = 'CHANGE_CURRENT_WALLET_CODE';
export const SYNC_WALLETS = 'SYNC_WALLETS';
export const SYNC_WALLETS_MAP = 'SYNC_WALLETS_MAP';
export const SYNC_FIX_WALLETS_MAP = 'SYNC_FIX_WALLETS_MAP';
export interface CodeMap {
  [index: string]: Wallet.SettingItem & Wallet.OriginRow;
}

export const defaultWallet: Wallet.SettingItem = {
  name: '默认钱包',
  iconIndex: 0,
  code: '-1',
  funds: [],
};

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
  return asyncWalles();
}

export function getCodeMap(config: Wallet.SettingItem[]) {
  return config.reduce<CodeMap>((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {});
}

export function addWallet(wallet: Wallet.SettingItem) {
  const { walletConfig } = getWalletConfig();
  Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, [...walletConfig, wallet]);
  return asyncWalles();
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
  return asyncWalles();
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
  return asyncWalles();
}

export function selectWallet(code: string) {
  Utils.SetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, code);
  return {
    type: CHANGE_CURRENT_WALLET_CODE,
    payload: code,
  };
}

export function asyncWalles() {
  const { walletConfig } = getWalletConfig();
  return {
    type: SYNC_WALLETS,
    payload: walletConfig,
  };
}

export function loadWalletsFunds() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const { walletConfig } = getWalletConfig();
      const { code: currentWalletCode } = getCurrentWallet();
      const collects = walletConfig
        .filter(({ code }) => code !== currentWalletCode)
        .map(
          ({ funds, code }) =>
            () =>
              getFunds(funds).then((funds) => {
                const now = dayjs().format('MM-DD HH:mm:ss');
                dispatch({
                  type: SYNC_WALLETS_MAP,
                  payload: {
                    code,
                    item: {
                      funds,
                      updateTime: now,
                    },
                  },
                });
                return funds;
              })
        );
      await Adapter.ChokeAllAdapter<(Fund.ResponseItem | null)[]>(
        collects,
        CONST.DEFAULT.LOAD_WALLET_DELAY
      );
    } catch (e) {
      console.log('刷新钱包基金出错', e);
    } finally {
    }
  };
}

export function loadFixWalletsFunds() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const { wallet } = getState();
      const { walletsMap } = wallet;
      const fixCollects = Object.keys(walletsMap).map((code) => {
        const funds = walletsMap[code].funds || [];
        const collectors = funds
          .filter(
            ({ fixDate, gztime }) =>
              !fixDate || fixDate !== gztime?.slice(5, 10)
          )
          .map(
            ({ fundcode }) =>
              () =>
                Services.Fund.GetFixFromEastMoney(fundcode!)
          );
        return () =>
          Adapter.ConCurrencyAllAdapter<Fund.FixData>(collectors).then(
            (fixFunds) => {
              const now = dayjs().format('MM-DD HH:mm:ss');
              dispatch({
                type: SYNC_FIX_WALLETS_MAP,
                payload: {
                  code,
                  item: {
                    funds: fixFunds,
                    updateTime: now,
                  },
                },
              });
              return fixFunds;
            }
          );
      });
      await Adapter.ChokeAllAdapter<(Fund.FixData | null)[]>(
        fixCollects,
        CONST.DEFAULT.LOAD_WALLET_DELAY
      );
    } catch (e) {
      console.log('刷新钱包基金fix出错', e);
    } finally {
    }
  };
}
