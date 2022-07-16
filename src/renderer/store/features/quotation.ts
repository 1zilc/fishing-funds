import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { AsyncThunkConfig } from '@/store';
import { sortQuotation } from '@/workers/sort.worker';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

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
    syncQuotationsAction(state, action: PayloadAction<(Quotation.ResponseItem & Quotation.ExtraRow)[]>) {
      state.quotations = action.payload;
    },
    setQuotationsLoadingAction(state, action: PayloadAction<boolean>) {
      state.quotationsLoading = action.payload;
    },
    syncFavoriteQuotationMapAction(state, action: PayloadAction<Record<string, boolean>>) {
      state.favoriteQuotationMap = action.payload;
    },
    toggleQuotationCollapseAction(state, { payload }: PayloadAction<Quotation.ResponseItem & Quotation.ExtraRow>) {
      state.quotations.forEach((item) => {
        if (item.name === payload.name) {
          item.collapse = !item.collapse;
        }
      });
    },
    toggleAllQuotationsCollapseAction(state) {
      const expandAll = state.quotations.every((item) => item.collapse);
      state.quotations.forEach((item) => {
        item.collapse = !expandAll;
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

export const setFavoriteQuotationMapAction = createAsyncThunk<void, { code: string; status: boolean }, AsyncThunkConfig>(
  'quotation/setFavoriteQuotationMapAction',
  async ({ code, status }, { dispatch, getState }) => {
    try {
      const { quotation } = getState();
      const favoriteQuotationMap = { ...quotation.favoriteQuotationMap, [code]: status };

      dispatch(syncFavoriteQuotationMapAction(favoriteQuotationMap));
    } catch (error) {}
  }
);

export const sortQuotationsCachedAction = createAsyncThunk<void, Quotation.ResponseItem[], AsyncThunkConfig>(
  'quotation/sortQuotationsCachedAction',
  async (responseQuotations, { dispatch, getState }) => {
    try {
      const {
        quotation: { quotations },
      } = getState();

      const quotationsCodeToMap = Utils.GetCodeMap(quotations, 'name');
      const quotationsWithCollapseChached = responseQuotations.filter(Boolean).map((_) => ({
        ...(quotationsCodeToMap[_.name] || {}),
        ..._,
      }));

      batch(() => {
        dispatch(syncQuotationsAction(quotationsWithCollapseChached));
        dispatch(sortQuotationsAction());
      });
    } catch (error) {}
  }
);

export const sortQuotationsAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'quotation/sortQuotationsAction',
  async (_, { dispatch, getState }) => {
    try {
      const {
        quotation: { quotations },
        sort: {
          sortMode: {
            quotationSortMode: { type, order },
          },
        },
      } = getState();

      const sortList = sortQuotation({
        module: Enums.TabKeyType.Quotation,
        list: quotations,
        sortType: type,
        orderType: order,
      });

      dispatch(syncQuotationsAction(sortList));
    } catch (error) {}
  }
);

export default quotationlice.reducer;
