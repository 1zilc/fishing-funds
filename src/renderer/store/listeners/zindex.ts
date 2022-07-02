import listenerMiddleware from '@/store/listeners';
import { syncZindexesConfigAction } from '@/store/features/zindex';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncZindexesConfigAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.ZINDEX_SETTING, action.payload.zindexConfig);
    },
  });
};
