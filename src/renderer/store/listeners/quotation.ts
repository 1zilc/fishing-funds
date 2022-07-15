import listenerMiddleware from '@/store/listeners';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import * as Enhancement from '@/utils/enhancement';
import * as CONST from '@/constants';

export default () => {
  listenerMiddleware.startListening({
    actionCreator: syncFavoriteQuotationMapAction,
    effect: async (action) => {
      Enhancement.SetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, action.payload);
    },
  });
};
