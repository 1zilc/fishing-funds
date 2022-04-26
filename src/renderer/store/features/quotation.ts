import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { TypedThunk } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

export interface QuotationState {
  quotations: (Quotation.ResponseItem & Quotation.ExtraRow)[];
  quotationsLoading: boolean;
  favoriteQuotationMap: Record<string, boolean>;
}

const initialState = {
  quotations: [],
  quotationsLoading: false,
  favoriteQuotationMap: {},
} as QuotationState;

const quotationlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    syncQuotations(state, action) {
      state.quotations = action.payload;
    },
    setQuotationsLoading(state, action: PayloadAction<boolean>) {
      state.quotationsLoading = action.payload;
    },
    syncFavoriteQuotationMap(state, action) {
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
  syncQuotations,
  setQuotationsLoading,
  syncFavoriteQuotationMap,
  toggleQuotationCollapseAction,
  toggleAllQuotationsCollapseAction,
} = quotationlice.actions;

export function syncFavoriteQuotationMapAction(code: string, status: boolean): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const { quotation } = getState();
      const favoriteQuotationMap = { ...quotation.favoriteQuotationMap, [code]: status };

      await Utils.SetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, favoriteQuotationMap);

      dispatch(syncFavoriteQuotationMap(favoriteQuotationMap));
    } catch (error) {}
  };
}

export function sortQuotationsCachedAction(responseQuotations: Quotation.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
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
        dispatch(syncQuotationsStateAction(quotationsWithCollapseChached));
        dispatch(sortQuotationsAction());
      });
    } catch (error) {}
  };
}

export function sortQuotationsAction(): TypedThunk {
  return (dispatch, getState) => {
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

      dispatch(syncQuotationsStateAction(sortList));
    } catch (error) {}
  };
}

export function syncQuotationsStateAction(quotations: Quotation.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(syncQuotations(quotations));
    } catch (error) {}
  };
}

export default quotationlice.reducer;
