import listenerMiddleware from '@/store/listeners';
import { updateAdjustmentNotificationDateAction, syncSettingAction } from '@/store/features/setting';
import * as Enhancement from '@/utils/enhancement';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncSettingAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.SYSTEM_SETTING, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateAdjustmentNotificationDateAction,
    effect: async (action) => {
      if (action.payload) {
        Enhancement.SetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, action.payload);
      } else {
        Enhancement.ClearStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
      }
    },
  });
};
