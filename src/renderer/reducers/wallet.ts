import { CHANGE_EYE_STATUS, CHANGE_CURRENT_WALLET_CODE, SYNC_WALLETS, SYNC_WALLET_CONFIG } from '@/actions/wallet';

import { Reducer } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export interface WalletState {
  eyeStatus: Enums.EyeStatus;
  currentWalletCode: string;
  wallets: Wallet.StateItem[];
  config: {
    walletConfig: Wallet.SettingItem[];
    codeMap: Helpers.Wallet.CodeWalletMap;
  };
}

const wallet: Reducer<WalletState> = (
  state = {
    wallets: [],
    config: { walletConfig: [], codeMap: {} },
    eyeStatus: Enums.EyeStatus.Open,
    currentWalletCode: '',
  },
  action
) => {
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
    case SYNC_WALLET_CONFIG:
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
};
export default wallet;
