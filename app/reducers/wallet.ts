import {
  Dispatch as ReduxDispatch,
  Store as ReduxStore,
  Action,
  AnyAction
} from 'redux';

import { UPDATE_UPTATETIME } from '../actions/wallet';

export interface WalletState {
  updateTime: string;
}

export default function wallet(
  state = {
    updateTime: '还没有刷新过哦～'
  },
  action: AnyAction
) {
  switch (action.type) {
    case UPDATE_UPTATETIME:
      return {
        ...state,
        updateTime: action.payload
      };
    default:
      return state;
  }
}
