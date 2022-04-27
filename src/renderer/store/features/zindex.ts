import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { TypedThunk } from '@/store';
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

const initialState = {
  zindexs: [],
  zindexsLoading: false,
  config: {
    zindexConfig: [],
    codeMap: {},
  },
} as ZindexState;

const zindexSlice = createSlice({
  name: 'zindex',
  initialState,
  reducers: {
    setZindexesLoading(state, action: PayloadAction<boolean>) {
      state.zindexsLoading = action.payload;
    },
    syncZindexes(state, action) {
      state.zindexs = action.payload;
    },
    syncZindexesConfig(state, action) {
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

export const { setZindexesLoading, syncZindexes, syncZindexesConfig, toggleZindexCollapseAction, toggleAllZindexsCollapseAction } =
  zindexSlice.actions;

export function addZindexAction(zindex: Zindex.SettingItem): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function deleteZindexAction(code: string): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function setZindexConfigAction(zindexConfig: Zindex.SettingItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const codeMap = Utils.GetCodeMap(zindexConfig, 'code');

      batch(() => {
        dispatch(syncZindexesConfig({ zindexConfig, codeMap }));
        dispatch(syncZindexsStateAction(zindexs));
      });
      Utils.SetStorage(CONST.STORAGE.ZINDEX_SETTING, zindexConfig);
    } catch (error) {}
  };
}

export function sortZindexsAction(): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function sortZindexsCachedAction(responseZindexs: Zindex.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function syncZindexsStateAction(zindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        zindex: {
          config: { codeMap },
        },
      } = getState();
      const filterZindexs = zindexs.filter(({ code }) => codeMap[code]);
      dispatch(syncZindexes(filterZindexs));
    } catch (error) {}
  };
}

export default zindexSlice.reducer;
