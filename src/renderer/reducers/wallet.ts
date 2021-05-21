import { AnyAction } from 'redux';

import {
  CHANGE_EYE_STATUS,
  CHANGE_CURRENT_WALLET_CODE,
  SYNC_WALLETS,
  SYNC_WALLETS_MAP,
  SYNC_FIX_WALLETS_MAP,
  defaultWallet,
  getWalletConfig,
} from '@/actions/wallet';

import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';

export interface WalletState {
  eyeStatus: Enums.EyeStatus;
  wallets: Wallet.SettingItem[];
  currentWalletCode: string;
  walletsMap: Record<string, Wallet.StateItem>;
}
function syncWalletsMap(
  state: WalletState,
  payload: { code: string; item: Wallet.StateItem }
) {
  const { code, item } = payload;
  const { walletsMap } = state;
  const cloneWalletsMap = Utils.DeepCopy(walletsMap);
  const { codeMap } = getWalletConfig();
  const walletConfig = codeMap[code];
  const fundsCodeToMap = (cloneWalletsMap[code]?.funds || []).reduce(
    (map, fund) => {
      map[fund.fundcode!] = fund;
      return map;
    },
    {} as any
  );

  item.funds = (item.funds || [])
    .filter((_) => !!_)
    .map((_) => ({
      ...(fundsCodeToMap[_!.fundcode!] || {}),
      ..._,
    }));

  const itemFundsCodeToMap = item.funds.reduce((map, fund) => {
    map[fund.fundcode!] = fund;
    return map;
  }, {} as any);

  walletConfig.funds.forEach((fund) => {
    const responseFund = itemFundsCodeToMap[fund.code];
    const stateFund = fundsCodeToMap[fund.code];
    if (!responseFund && stateFund) {
      item.funds.push(stateFund);
    }
  });

  cloneWalletsMap[code] = item;

  return {
    ...state,
    walletsMap: cloneWalletsMap,
  };
}

function syncFixWalletsMap(
  state: WalletState,
  payload: { code: string; item: Wallet.StateItem }
) {
  const { code, item } = payload;
  const { funds: fixFunds } = item;
  const { walletsMap } = state;
  const cloneWalletsMap = Utils.DeepCopy(walletsMap);
  const funds = cloneWalletsMap[code]?.funds || [];

  const fixFundMap = fixFunds
    .filter((_) => !!_)
    .reduce((map, fund) => {
      map[fund.code!] = fund;
      return map;
    }, {} as { [index: string]: Fund.FixData });

  funds.forEach((fund) => {
    const fixFund = fixFundMap[fund.fundcode!];
    if (fixFund) {
      fund.fixZzl = fixFund.fixZzl;
      fund.fixDate = fixFund.fixDate;
      fund.fixDwjz = fixFund.fixDwjz;
    }
  });
  cloneWalletsMap[code].funds = funds;

  return {
    ...state,
    walletsMap: cloneWalletsMap,
  };
}

export default function wallet(
  state: WalletState = {
    eyeStatus: Utils.GetStorage(CONST.STORAGE.EYE_STATUS, Enums.EyeStatus.Open),
    currentWalletCode: Utils.GetStorage(
      CONST.STORAGE.CURRENT_WALLET_CODE,
      defaultWallet.code
    ),
    wallets: Utils.GetStorage(CONST.STORAGE.WALLET_SETTING, [defaultWallet]),
    walletsMap: {},
  },

  action: AnyAction
): WalletState {
  switch (action.type) {
    case CHANGE_EYE_STATUS:
      return {
        ...state,
        eyeStatus: action.payload,
      };
    case CHANGE_CURRENT_WALLET_CODE:
      return {
        ...state,
        currentWalletCode: action.payload,
      };
    case SYNC_WALLETS:
      return {
        ...state,
        wallets: action.payload,
      };
    case SYNC_WALLETS_MAP:
      return syncWalletsMap(state, action.payload);
    case SYNC_FIX_WALLETS_MAP:
      return syncFixWalletsMap(state, action.payload);
    default:
      return state;
  }
}
