import dayjs from 'dayjs';
import { store } from '@/.';
import { updateWalletStateAction, syncFixWalletStateAction } from '@/actions/wallet';

import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import * as Adpters from '@/utils/adpters';
import * as Services from '@/services';

export interface CodeWalletMap {
  [index: string]: Wallet.SettingItem & Wallet.OriginRow;
}

export const defaultWallet: Wallet.SettingItem = {
  name: '默认钱包',
  iconIndex: 0,
  code: '-1',
  funds: [],
};

export const walletIcons = new Array(40).fill('').map((_, index) => require(`@assets/wallet/${index}.png`));

export function GetWalletConfig() {
  const {
    wallet: {
      config: { walletConfig },
    },
  } = store.getState();
  const codeMap = GetCodeMap(walletConfig);
  return { walletConfig, codeMap };
}

export function GetCurrentWalletConfig(code: string) {
  const { walletConfig } = GetWalletConfig();
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
  const {
    wallet: { eyeStatus },
  } = store.getState();
  return eyeStatus;
}

export function GetCurrentWalletCode() {
  const {
    wallet: { currentWalletCode },
  } = store.getState();
  return currentWalletCode;
}

export function GetCurrentWalletState() {
  const currentWalletCode = GetCurrentWalletCode();
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

export async function LoadWalletsFunds() {
  try {
    const { walletConfig } = GetWalletConfig();
    const collects = walletConfig.map(({ funds: fundsConfig, code: walletCode }) => async () => {
      const responseFunds = (await Helpers.Fund.GetFunds(fundsConfig)).filter(Utils.NotEmpty);
      const sortFunds = Helpers.Fund.SortFunds(responseFunds, walletCode);
      const now = dayjs().format('MM-DD HH:mm:ss');
      store.dispatch(
        updateWalletStateAction({
          code: walletCode,
          funds: sortFunds,
          updateTime: now,
        })
      );
      return responseFunds;
    });
    await Adpters.ChokeAllAdapter<(Fund.ResponseItem | null)[]>(collects, CONST.DEFAULT.LOAD_WALLET_DELAY);
  } catch (error) {}
}

export async function loadFixWalletsFunds() {
  try {
    const {
      wallet: { wallets },
    } = store.getState();

    const fixCollects = wallets.map((wallet) => {
      const collectors = (wallet.funds || [])
        .filter(({ fixDate, gztime }) => !fixDate || fixDate !== gztime?.slice(5, 10))
        .map(
          ({ fundcode }) =>
            () =>
              Services.Fund.GetFixFromEastMoney(fundcode!)
        );
      return async () => {
        const fixFunds = await Adpters.ConCurrencyAllAdapter<Fund.FixData>(collectors);
        const now = dayjs().format('MM-DD HH:mm:ss');
        store.dispatch(
          syncFixWalletStateAction({
            code: wallet.code,
            funds: fixFunds.filter(Utils.NotEmpty),
            updateTime: now,
          })
        );
        return fixFunds;
      };
    });

    await Adpters.ChokeAllAdapter<(Fund.FixData | null)[]>(fixCollects, CONST.DEFAULT.LOAD_WALLET_DELAY);
  } catch (error) {}
}
