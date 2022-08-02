import listenerMiddleware from '@/store/listeners';
import { syncWebConfigAction } from '@/store/features/web';
import * as Enhancement from '@/utils/enhancement';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncWebConfigAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.WEB_SETTING, action.payload.webConfig);
    },
  });
};
