import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export const { syncQuotations, setQuotationsLoading, syncFavoriteQuotationMap } = quotationlice.actions;

export default quotationlice.reducer;
