import listenerMiddleware from '@/store/listeners';
import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import * as Enhancement from '@/utils/enhancement';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncTabsActiveKeyAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.TABS_ACTIVE_KEY, action.payload);
    },
  });
};
