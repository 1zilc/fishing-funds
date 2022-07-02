import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { batch } from 'react-redux';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
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
  async (zindex, { dispatch, getState }) => {
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
  async (code, { dispatch, getState }) => {
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
  async (zindexConfig, { dispatch, getState }) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const codeMap = Utils.GetCodeMap(zindexConfig, 'code');

      batch(() => {
        dispatch(syncZindexesConfigAction({ zindexConfig, codeMap }));
        dispatch(syncZindexsStateAction(zindexs));
      });
    } catch (error) {}
  }
);

export const sortZindexsAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'zindex/sortZindexsAction',
  async (_, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          zindexs,
          config: { codeMap },
        },
        sort: {
          sortMode: {
            zindexSortMode: { type: zindexSortType, order: zindexSortorder },
          },
        },
      } = getState();

      const sortList = zindexs.slice();

      sortList.sort((a, b) => {
        const t = zindexSortorder === Enums.SortOrderType.Asc ? 1 : -1;
        switch (zindexSortType) {
          case Enums.ZindexSortType.Zdd:
            return (a.zdd - b.zdd) * t;
          case Enums.ZindexSortType.Zdf:
            return (a.zdf - b.zdf) * t;
          case Enums.ZindexSortType.Zsz:
            return (a.zsz - b.zsz) * t;
          case Enums.ZindexSortType.Name:
            return b.name.localeCompare(a.name, 'zh') * t;
          case Enums.ZindexSortType.Custom:
          default:
            return (codeMap[b.code]?.originSort - codeMap[a.code]?.originSort) * t;
        }
      });

      dispatch(syncZindexsStateAction(sortList));
    } catch (error) {}
  }
);

export const sortZindexsCachedAction = createAsyncThunk<void, Zindex.ResponseItem[], AsyncThunkConfig>(
  'zindex/sortZindexsCachedAction',
  async (responseZindexs, { dispatch, getState }) => {
    try {
      const {
        zindex: {
          zindexs,
          config: { zindexConfig },
        },
      } = getState();

      const zindexsCodeToMap = Utils.GetCodeMap(zindexs, 'code');
      const zindexsWithCollapseChached = responseZindexs.map((_) => ({
        ...(zindexsCodeToMap[_.code] || {}),
        ..._,
      }));
      const zindexWithChachedCodeToMap = Utils.GetCodeMap(zindexsWithCollapseChached, 'code');
      zindexConfig.forEach((zindex) => {
        const responseZindex = zindexWithChachedCodeToMap[zindex.code];
        const stateZindex = zindexsCodeToMap[zindex.code];
        if (!responseZindex && stateZindex) {
          zindexsWithCollapseChached.push(stateZindex);
        }
      });

      batch(() => {
        dispatch(syncZindexsStateAction(zindexsWithCollapseChached));
        dispatch(sortZindexsAction());
      });
    } catch (error) {}
  }
);

export const syncZindexsStateAction = createAsyncThunk<void, (Zindex.ResponseItem & Zindex.ExtraRow)[], AsyncThunkConfig>(
  'zindex/syncZindexsStateAction',
  async (zindexs, { dispatch, getState }) => {
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
