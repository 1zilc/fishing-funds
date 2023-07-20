import dayjs from 'dayjs';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { setWalletConfigAction, updateWalletStateAction, setWalletStateAction } from '@/store/features/wallet';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export interface StockState {
  stocksLoading: boolean;
  industryMap: Record<string, Stock.IndustryItem[]>;
}

const initialState: StockState = {
  stocksLoading: false,
  industryMap: {},
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStocksLoadingAction(state, { payload }: PayloadAction<boolean>) {
      state.stocksLoading = payload;
    },
    setIndustryMapAction(state, { payload }: PayloadAction<{ industrys: Stock.IndustryItem[]; secid: string }>) {
      state.industryMap = { ...state.industryMap, [payload.secid]: payload.industrys };
    },
  },
});

export const { setStocksLoadingAction, setIndustryMapAction } = stockSlice.actions;

export const addStockAction = createAsyncThunk<void, Stock.SettingItem, AsyncThunkConfig>(
  'stock/addStockAction',
  (stock, { dispatch, getState }) => {
    try {
      const {
        wallet: { currentWalletCode, stockConfig },
      } = getState();

      const config = Helpers.Base.Add({
        list: Utils.DeepCopy(stockConfig),
        key: 'secid',
        data: stock,
      });

      dispatch(setStockConfigAction({ config, walletCode: currentWalletCode }));
    } catch (error) {}
  }
);

export const updateStockAction = createAsyncThunk<
  void,
  Partial<Stock.SettingItem> & {
    secid: string;
  },
  AsyncThunkConfig
>('stock/updateStockAction', (stock, { dispatch, getState }) => {
  try {
    const {
      wallet: { currentWalletCode, stockConfig },
    } = getState();

    const config = Helpers.Base.Update({
      list: Utils.DeepCopy(stockConfig),
      key: 'secid',
      data: stock,
    });

    dispatch(setStockConfigAction({ config, walletCode: currentWalletCode }));
  } catch (error) {}
});

export const deleteStockAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'stock/deleteStockAction',
  (secid, { dispatch, getState }) => {
    try {
      const {
        wallet: { currentWalletCode, stockConfig },
      } = getState();

      const config = Helpers.Base.Delete({
        list: Utils.DeepCopy(stockConfig),
        key: 'secid',
        data: secid,
      });

      dispatch(setStockConfigAction({ config, walletCode: currentWalletCode }));
    } catch (error) {}
  }
);

export const sortStocksAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'stock/sortStocksAction',
  (walletCode, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          wallets,
          config: { walletConfig },
        },
        sort: {
          sortMode: {
            stockSortMode: { type, order },
          },
        },
      } = getState();

      const { stocks, updateTime, code } = Helpers.Wallet.GetCurrentWalletState(walletCode, wallets);
      const { codeMap } = Helpers.Stock.GetStockConfig(walletCode, walletConfig);

      const sortList = Helpers.Stock.SortStock({
        codeMap,
        list: stocks,
        sortType: type,
        orderType: order,
      });

      dispatch(setWalletStateAction({ code, stocks: sortList, updateTime }));
    } catch (error) {}
  }
);

export const sortStocksCachedAction = createAsyncThunk<
  void,
  { responseStocks: Stock.ResponseItem[]; walletCode: string },
  AsyncThunkConfig
>('stock/sortStocksCachedAction', ({ responseStocks, walletCode }, { getState, dispatch }) => {
  try {
    const {
      wallet: {
        config: { walletConfig },
        wallets,
      },
    } = getState();

    const { stockConfig } = Helpers.Stock.GetStockConfig(walletCode, walletConfig);
    const { stocks } = Helpers.Wallet.GetCurrentWalletState(walletCode, wallets);
    const now = dayjs().format('MM-DD HH:mm:ss');

    const stocksWithChached = Utils.MergeStateWithResponse({
      config: stockConfig,
      configKey: 'secid',
      stateKey: 'secid',
      state: stocks,
      response: responseStocks,
    });

    dispatch(setWalletStateAction({ code: walletCode, stocks: stocksWithChached, updateTime: now }));
    dispatch(sortStocksAction(walletCode));
  } catch (error) {}
});

export const setStockConfigAction = createAsyncThunk<
  void,
  { config: Stock.SettingItem[]; walletCode: string },
  AsyncThunkConfig
>('stock/setStockConfigAction', ({ config, walletCode }, { dispatch, getState }) => {
  try {
    const {
      wallet: {
        config: { walletConfig },
        currentWallet,
      },
    } = getState();

    const newWalletConfig = walletConfig.map((item) => ({
      ...item,
      stocks: walletCode === item.code ? config : item.stocks,
    }));

    dispatch(setWalletConfigAction(newWalletConfig));
    dispatch(updateWalletStateAction(currentWallet));
  } catch (error) {}
});

export default stockSlice.reducer;
