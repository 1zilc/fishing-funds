import { batch } from 'react-redux';
import { TypedThunk } from '@/store';
import { syncZindexes, syncZindexesConfig } from '@/store/features/zindex';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export function addZindexAction(zindex: Zindex.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { zindexConfig } = Helpers.Zindex.GetZindexConfig();
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
      const { zindexConfig } = Helpers.Zindex.GetZindexConfig();

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
      const codeMap = Helpers.Zindex.GetCodeMap(zindexConfig);

      batch(() => {
        dispatch(syncZindexesConfig({ zindexConfig, codeMap }));
        dispatch(syncZindexsStateAction(zindexs));
      });

      Utils.SetStorage(CONST.STORAGE.ZINDEX_SETTING, zindexConfig);
    } catch (error) {}
  };
}

export function toggleZindexCollapseAction(zindex: Zindex.ResponseItem & Zindex.ExtraRow): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();

      const cloneZindexs = Utils.DeepCopy(zindexs);
      cloneZindexs.forEach((_) => {
        if (_.code === zindex.code) {
          _.collapse = !zindex.collapse;
        }
      });
      dispatch(syncZindexsStateAction(cloneZindexs));
    } catch (error) {}
  };
}

export function toggleAllZindexsCollapseAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const cloneZindexs = Utils.DeepCopy(zindexs);
      const expandAllZindexs = zindexs.every((_) => _.collapse);
      cloneZindexs.forEach((_) => {
        _.collapse = !expandAllZindexs;
      });
      dispatch(syncZindexsStateAction(cloneZindexs));
    } catch (error) {}
  };
}

export function sortZindexsAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const sortZindexs = Helpers.Zindex.SortZindexs(zindexs);
      dispatch(syncZindexsStateAction(sortZindexs));
    } catch (error) {}
  };
}

export function sortZindexsCachedAction(responseZindexs: Zindex.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const { zindexConfig } = Helpers.Zindex.GetZindexConfig();
      const zindexsCodeToMap = zindexs.reduce((map, zindex) => {
        map[zindex.code] = zindex;
        return map;
      }, {} as any);

      const zindexsWithCollapseChached = responseZindexs.map((_) => ({
        ...(zindexsCodeToMap[_.code] || {}),
        ..._,
      }));

      const zindexWithChachedCodeToMap = zindexsWithCollapseChached.reduce((map, zindex) => {
        map[zindex.code] = zindex;
        return map;
      }, {} as any);

      zindexConfig.forEach((zindex) => {
        const responseZindex = zindexWithChachedCodeToMap[zindex.code];
        const stateZindex = zindexsCodeToMap[zindex.code];
        if (!responseZindex && stateZindex) {
          zindexsWithCollapseChached.push(stateZindex);
        }
      });

      const sortZindexs = Helpers.Zindex.SortZindexs(zindexsWithCollapseChached);
      dispatch(syncZindexsStateAction(sortZindexs));
    } catch (error) {}
  };
}

export function syncZindexsStateAction(zindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Zindex.GetZindexConfig();
      const filterZindexs = zindexs.filter(({ code }) => codeMap[code]);
      dispatch(syncZindexes(filterZindexs));
    } catch (error) {}
  };
}
