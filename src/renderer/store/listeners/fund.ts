import listenerMiddleware from '@/store/listeners';
import { syncFundRatingMapAction, syncRemoteFundsMapAction } from '@/store/features/fund';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncRemoteFundsMapAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.REMOTE_FUND_MAP, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncFundRatingMapAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.FUND_RATING_MAP, action.payload);
    },
  });
};
