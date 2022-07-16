import listenerMiddleware from '@/store/listeners';
import { syncZindexesConfigAction } from '@/store/features/zindex';
import * as Enhancement from '@/utils/enhancement';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncZindexesConfigAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.ZINDEX_SETTING, action.payload.zindexConfig);
    },
  });
};
