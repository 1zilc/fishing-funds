import listenerMiddleware from '@/store/listeners';
import { syncRemoteCoinsMapAction } from '@/store/features/coin';
import { syncFundRatingMapAction, syncRemoteFundsMapAction } from '@/store/features/fund';
import * as CONST from '@/constants';

const electronStore = window.contextModules.electronStore;

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncRemoteCoinsMapAction,
    effect: async (action) => {
      electronStore.set('cache', CONST.STORAGE.REMOTE_COIN_MAP, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncRemoteFundsMapAction,
    effect: async (action) => {
      electronStore.set('cache', CONST.STORAGE.REMOTE_FUND_MAP, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncFundRatingMapAction,
    effect: async (action) => {
      electronStore.set('cache', CONST.STORAGE.FUND_RATING_MAP, action.payload);
    },
  });
};
