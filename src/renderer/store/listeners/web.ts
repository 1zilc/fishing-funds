import listenerMiddleware from '@/store/listeners';
import { syncWebConfigAction } from '@/store/features/web';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncWebConfigAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.WEB_SETTING, action.payload.webConfig);
    },
  });
};
