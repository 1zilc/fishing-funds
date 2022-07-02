import listenerMiddleware from '@/store/listeners';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncFavoriteQuotationMapAction,
    effect: async (action) => {
      Utils.SetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, action.payload);
    },
  });
};