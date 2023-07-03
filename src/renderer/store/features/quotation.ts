import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export interface QuotationState {
  quotations: (Quotation.ResponseItem & Quotation.ExtraRow)[];
  quotationsLoading: boolean;
  favoriteQuotationMap: Record<string, boolean>;
}

const initialState: QuotationState = {
  quotations: [],
  quotationsLoading: false,
  favoriteQuotationMap: {},
};

const quotationlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    syncQuotationsAction(state, action: PayloadAction<QuotationState['quotations']>) {
      state.quotations = action.payload;
    },
    setQuotationsLoadingAction(state, action: PayloadAction<boolean>) {
      state.quotationsLoading = action.payload;
    },
    syncFavoriteQuotationMapAction(state, action: PayloadAction<Record<string, boolean>>) {
      state.favoriteQuotationMap = action.payload;
    },
    toggleQuotationCollapseAction(state, { payload }: PayloadAction<QuotationState['quotations'][number]>) {
      Helpers.Base.Collapse({
        list: state.quotations,
        key: 'code',
        data: payload,
      });
    },
    toggleAllQuotationsCollapseAction(state) {
      Helpers.Base.CollapseAll({
        list: state.quotations,
      });
    },
  },
});

export const {
  syncQuotationsAction,
  setQuotationsLoadingAction,
  syncFavoriteQuotationMapAction,
  toggleQuotationCollapseAction,
  toggleAllQuotationsCollapseAction,
} = quotationlice.actions;

export const setFavoriteQuotationMapAction = createAsyncThunk<
  void,
  { code: string; status: boolean },
  AsyncThunkConfig
>('quotation/setFavoriteQuotationMapAction', ({ code, status }, { dispatch, getState }) => {
  try {
    const { quotation } = getState();
    const favoriteQuotationMap = { ...quotation.favoriteQuotationMap, [code]: status };

    dispatch(syncFavoriteQuotationMapAction(favoriteQuotationMap));
  } catch (error) {}
});

export const sortQuotationsCachedAction = createAsyncThunk<void, Quotation.ResponseItem[], AsyncThunkConfig>(
  'quotation/sortQuotationsCachedAction',
  (responseQuotations, { dispatch, getState }) => {
    try {
      const {
        quotation: { quotations },
      } = getState();

      const quotationsCodeToMap = Utils.GetCodeMap(quotations, 'name');
      const quotationsWithCollapseChached = responseQuotations.filter(Boolean).map((_) => ({
        ...(quotationsCodeToMap[_.name] || {}),
        ..._,
      }));

      dispatch(sortQuotationsAction(quotationsWithCollapseChached));
    } catch (error) {}
  }
);

export const sortQuotationsAction = createAsyncThunk<void, QuotationState['quotations'] | undefined, AsyncThunkConfig>(
  'quotation/sortQuotationsAction',
  (list, { dispatch, getState }) => {
    try {
      const {
        quotation: { quotations },
        sort: {
          sortMode: {
            quotationSortMode: { type, order },
          },
        },
      } = getState();

      const sortList = Helpers.Quotation.SortQuotation({
        list: list || quotations,
        sortType: type,
        orderType: order,
      });

      dispatch(syncQuotationsAction(sortList));
    } catch (error) {}
  }
);

export default quotationlice.reducer;
