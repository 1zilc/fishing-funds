import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export interface ZindexState {
  zindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[];
  zindexsLoading: boolean;
  config: { zindexConfig: Zindex.SettingItem[]; codeMap: Zindex.CodeMap };
}

export const defaultZindexConfig = [
  // 沪深指数
  { name: '上证指数', code: '1.000001' },
  { name: '深证成指', code: '0.399001' },
  { name: '科创50', code: '1.000688' },
  { name: '沪深300', code: '1.000300' },
  { name: '创业板指', code: '0.399006' },
  // 美洲股市
  { name: '道琼斯', code: '100.DJIA' },
  { name: '标普500', code: '100.SPX' },
  { name: '纳斯达克', code: '100.NDX' },
];

const initialState: ZindexState = {
  zindexs: [],
  zindexsLoading: false,
  config: {
    zindexConfig: [],
    codeMap: {},
  },
};

const zindexSlice = createSlice({
  name: 'zindex',
  initialState,
  reducers: {
    setZindexesLoadingAction(state, action: PayloadAction<boolean>) {
      state.zindexsLoading = action.payload;
    },
    filterZindexsStateAction(state) {
      state.zindexs = state.zindexs.filter(({ code }) => state.config.codeMap[code]);
    },
    syncZindexesStateAction(state, action: PayloadAction<ZindexState['zindexs']>) {
      state.zindexs = action.payload;
    },
    syncZindexesConfigAction(state, action: PayloadAction<ZindexState['config']>) {
      state.config = action.payload;
    },
    toggleZindexCollapseAction(state, { payload }: PayloadAction<ZindexState['zindexs'][number]>) {
      Helpers.Base.Collapse({
        list: state.zindexs,
        key: 'code',
        data: payload,
      });
    },
    toggleAllZindexsCollapseAction(state) {
      Helpers.Base.CollapseAll({
        list: state.zindexs,
      });
    },
  },
});

export const {
  setZindexesLoadingAction,
  filterZindexsStateAction,
  syncZindexesStateAction,
  syncZindexesConfigAction,
  toggleZindexCollapseAction,
  toggleAllZindexsCollapseAction,
} = zindexSlice.actions;

export const addZindexAction = createAsyncThunk<void, Zindex.SettingItem, AsyncThunkConfig>(
  'zindex/addZindexAction',
  (zindex, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          config: { zindexConfig },
        },
      } = getState();

      const config = Helpers.Base.Add({
        list: Utils.DeepCopy(zindexConfig),
        key: 'code',
        data: zindex,
      });

      dispatch(setZindexConfigAction(config));
    } catch (error) {}
  }
);

export const updateZindexAction = createAsyncThunk<
  void,
  Partial<Zindex.SettingItem> & {
    code: string;
  },
  AsyncThunkConfig
>('zindex/updateZindexAction', (zindex, { dispatch, getState }) => {
  try {
    const {
      zindex: {
        config: { zindexConfig },
      },
    } = getState();

    const config = Helpers.Base.Update({
      list: Utils.DeepCopy(zindexConfig),
      key: 'code',
      data: zindex,
    });

    dispatch(setZindexConfigAction(config));
  } catch (error) {}
});

export const deleteZindexAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'zindex/deleteZindexAction',
  (code, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          config: { zindexConfig },
        },
      } = getState();

      const config = Helpers.Base.Delete({
        list: Utils.DeepCopy(zindexConfig),
        key: 'code',
        data: code,
      });

      dispatch(setZindexConfigAction(config));
    } catch (error) {}
  }
);

export const sortZindexsAction = createAsyncThunk<void, ZindexState['zindexs'] | undefined, AsyncThunkConfig>(
  'zindex/sortZindexsAction',
  (list, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          zindexs,
          config: { codeMap },
        },
        sort: {
          sortMode: {
            zindexSortMode: { type, order },
          },
        },
      } = getState();

      const sortList = Helpers.Zindex.SortZindex({
        codeMap,
        list: list || zindexs,
        sortType: type,
        orderType: order,
      });

      dispatch(syncZindexesStateAction(sortList));
    } catch (error) {}
  }
);

export const sortZindexsCachedAction = createAsyncThunk<void, Zindex.ResponseItem[], AsyncThunkConfig>(
  'zindex/sortZindexsCachedAction',
  (responseZindexs, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          zindexs,
          config: { zindexConfig },
        },
      } = getState();

      const zindexsWithChached = Utils.MergeStateWithResponse({
        config: zindexConfig,
        configKey: 'code',
        stateKey: 'code',
        state: zindexs,
        response: responseZindexs,
      });

      dispatch(sortZindexsAction(zindexsWithChached));
    } catch (error) {}
  }
);

export const setZindexConfigAction = createAsyncThunk<void, Zindex.SettingItem[], AsyncThunkConfig>(
  'zindex/setZindexConfigAction',
  (zindexConfig, { dispatch }) => {
    try {
      const codeMap = Utils.GetCodeMap(zindexConfig, 'code');
      dispatch(syncZindexesConfigAction({ zindexConfig, codeMap }));

      dispatch(filterZindexsStateAction());
    } catch (error) {}
  }
);

export default zindexSlice.reducer;
