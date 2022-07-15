import listenerMiddleware from '@/store/listeners';
import { syncStocksConfigAction } from '@/store/features/stock';
import * as Enhancement from '@/utils/enhancement';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncStocksConfigAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.STOCK_SETTING, action.payload.stockConfig);
    },
  });
};
