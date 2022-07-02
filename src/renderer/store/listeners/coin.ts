import listenerMiddleware from '@/store/listeners';
import { syncCoinsConfigAction, syncRemoteCoinsMapAction } from '@/store/features/coin';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncCoinsConfigAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.COIN_SETTING, action.payload.coinConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncRemoteCoinsMapAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.REMOTE_COIN_MAP, action.payload);
    },
  });
};
