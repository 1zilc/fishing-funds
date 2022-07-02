import listenerMiddleware from '@/store/listeners';
import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncTabsActiveKeyAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.TABS_ACTIVE_KEY, action.payload);
    },
  });
};
