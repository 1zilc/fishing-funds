import listenerMiddleware from '@/store/listeners';
import { updateAdjustmentNotificationDateAction, syncSettingAction } from '@/store/features/setting';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncSettingAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateAdjustmentNotificationDateAction,
    effect: async (action) => {
      if (action.payload) {
        Utils.SetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, action.payload);
      } else {
        Utils.ClearStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
      }
    },
  });
};
