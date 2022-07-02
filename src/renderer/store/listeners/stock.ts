import listenerMiddleware from '@/store/listeners';
import { syncStocksConfigAction } from '@/store/features/stock';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncStocksConfigAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.STOCK_SETTING, action.payload.stockConfig);
    },
  });
};
