import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { AsyncThunkConfig } from '@/store';
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
            quotationSortMode: { type: quotationSortType, order: quotationSortorder },
          },
        },
      } = getState();

      const sortList: Quotation.ResponseItem[] = Utils.DeepCopy(quotations);

      sortList.sort((a, b) => {
        const t = quotationSortorder === Enums.SortOrderType.Asc ? 1 : -1;
        switch (quotationSortType) {
          case Enums.QuotationSortType.Zde:
            return (Number(a.zde) - Number(b.zde)) * t;
          case Enums.QuotationSortType.Zdd:
            return (Number(a.zdd) - Number(b.zdd)) * t;
          case Enums.QuotationSortType.Zsz:
            return (Number(a.zsz) - Number(b.zsz)) * t;
          case Enums.QuotationSortType.Zxj:
            return (Number(a.zxj) - Number(b.zxj)) * t;
          case Enums.QuotationSortType.Szjs:
            return (Number(a.szjs) - Number(b.szjs)) * t;
          case Enums.QuotationSortType.Xdjs:
            return (Number(a.xdjs) - Number(b.xdjs)) * t;
          case Enums.QuotationSortType.Name:
            return b.name.localeCompare(a.name, 'zh') * t;
          case Enums.QuotationSortType.Zdf:
          default:
            return (Number(a.zdf) - Number(b.zdf)) * t;
        }
      });

      dispatch(syncQuotationsAction(sortList));
    } catch (error) {}
  }
);

export default quotationlice.reducer;
