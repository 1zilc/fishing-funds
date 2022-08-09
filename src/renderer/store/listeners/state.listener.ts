import listenerMiddleware from '@/store/listeners';
import { syncEyeStatusAction } from '@/store/features/wallet';
import { updateAdjustmentNotificationDateAction } from '@/store/features/setting';
import { syncSortModeAction, syncViewModeAction } from '@/store/features/sort';
import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import * as CONST from '@/constants';

const electronStore = window.contextModules.electronStore;

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncEyeStatusAction,
    effect: async (action) => {
      electronStore.set('state', CONST.STORAGE.EYE_STATUS, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncTabsActiveKeyAction,
    effect: async (action) => {
      electronStore.set('state', CONST.STORAGE.TABS_ACTIVE_KEY, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateAdjustmentNotificationDateAction,
    effect: async (action) => {
      if (action.payload) {
        electronStore.set('state', CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, action.payload);
      } else {
        electronStore.delete('state', CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
      }
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncSortModeAction,
    effect: async (action) => {
      electronStore.set('state', CONST.STORAGE.SORT_MODE, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncViewModeAction,
    effect: async (action) => {
      electronStore.set('state', CONST.STORAGE.VIEW_MODE, action.payload);
    },
  });
};
