import listenerMiddleware from '@/store/listeners';
import { syncSortModeAction, syncViewModeAction } from '@/store/features/sort';
import * as Enhancement from '@/utils/enhancement';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncSortModeAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.SORT_MODE, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncViewModeAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.VIEW_MODE, action.payload);
    },
  });
};
