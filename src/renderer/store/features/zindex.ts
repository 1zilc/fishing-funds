import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { sortZindex } from '@/workers/sort.worker';
import { mergeStateWithResponse } from '@/workers/merge.worker';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

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
    syncZindexesAction(state, action: PayloadAction<(Zindex.ResponseItem & Zindex.ExtraRow)[]>) {
      state.zindexs = action.payload;
    },
    syncZindexesConfigAction(state, action: PayloadAction<{ zindexConfig: Zindex.SettingItem[]; codeMap: Zindex.CodeMap }>) {
      state.config = action.payload;
    },
    toggleZindexCollapseAction(state, { payload }: PayloadAction<Zindex.ResponseItem & Zindex.ExtraRow>) {
      state.zindexs.forEach((item) => {
        if (item.code === payload.code) {
          item.collapse = !item.collapse;
        }
      });
    },
    toggleAllZindexsCollapseAction(state) {
      const expandAll = state.zindexs.every((item) => item.collapse);
      state.zindexs.forEach((item) => {
        item.collapse = !expandAll;
      });
    },
  },
});

export const {
  setZindexesLoadingAction,
  syncZindexesAction,
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
      const cloneZindexConfig = Utils.DeepCopy(zindexConfig);
      const exist = cloneZindexConfig.find((item) => zindex.code === item.code);
      if (!exist) {
        cloneZindexConfig.push(zindex);
      }
      dispatch(setZindexConfigAction(cloneZindexConfig));
    } catch (error) {}
  }
);

export const deleteZindexAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'zindex/deleteZindexAction',
  (code, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          config: { zindexConfig },
        },
      } = getState();

      zindexConfig.forEach((item, index) => {
        if (code === item.code) {
          const cloneZindexSetting = JSON.parse(JSON.stringify(zindexConfig));
          cloneZindexSetting.splice(index, 1);
          dispatch(setZindexConfigAction(cloneZindexSetting));
        }
      });
    } catch (error) {}
  }
);

export const setZindexConfigAction = createAsyncThunk<void, Zindex.SettingItem[], AsyncThunkConfig>(
  'zindex/setZindexConfigAction',
  (zindexConfig, { dispatch, getState }) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const codeMap = Utils.GetCodeMap(zindexConfig, 'code');

      dispatch(syncZindexesConfigAction({ zindexConfig, codeMap }));
      dispatch(syncZindexsStateAction(zindexs));
    } catch (error) {}
  }
);

export const sortZindexsAction = createAsyncThunk<void, void, AsyncThunkConfig>('zindex/sortZindexsAction', (_, { dispatch, getState }) => {
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

    const sortList = sortZindex({
      module: Enums.TabKeyType.Zindex,
      codeMap,
      list: zindexs,
      sortType: type,
      orderType: order,
    });

    dispatch(syncZindexsStateAction(sortList));
  } catch (error) {}
});

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

      const zindexsWithChached = mergeStateWithResponse({
        config: zindexConfig,
        configKey: 'code',
        stateKey: 'code',
        state: zindexs,
        response: responseZindexs,
      });

      dispatch(syncZindexsStateAction(zindexsWithChached));
      dispatch(sortZindexsAction());
    } catch (error) {}
  }
);

export const syncZindexsStateAction = createAsyncThunk<void, (Zindex.ResponseItem & Zindex.ExtraRow)[], AsyncThunkConfig>(
  'zindex/syncZindexsStateAction',
  (zindexs, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          config: { codeMap },
        },
      } = getState();
      const filterZindexs = zindexs.filter(({ code }) => codeMap[code]);
      dispatch(syncZindexesAction(filterZindexs));
    } catch (error) {}
  }
);

export default zindexSlice.reducer;
