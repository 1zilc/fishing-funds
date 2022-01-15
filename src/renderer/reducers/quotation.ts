import { Reducer } from '@/reducers/types';
import { SET_QUOTATIONS_LOADING, SYNC_QUOTATIONS, SYNC_FAVORITE_QUOTATION_MAP } from '@/actions/quotation';
import * as Helpers from '@/helpers';

export interface QuotationState {
  quotations: (Quotation.ResponseItem & Quotation.ExtraRow)[];
  quotationsLoading: boolean;
  favoriteQuotationMap: Record<string, boolean>;
}

const quotation: Reducer<QuotationState> = (
  state = {
    quotations: [],
    quotationsLoading: false,
    favoriteQuotationMap: {},
  },
  action
) => {
  switch (action.type) {
    case SYNC_QUOTATIONS:
      return {
        ...state,
        quotations: action.payload,
      };
    case SET_QUOTATIONS_LOADING:
      return {
        ...state,
        quotationsLoading: action.payload,
      };
    case SYNC_FAVORITE_QUOTATION_MAP:
      return {
        ...state,
        favoriteQuotationMap: action.payload,
      };
    default:
      return state;
  }
};
export default quotation;
