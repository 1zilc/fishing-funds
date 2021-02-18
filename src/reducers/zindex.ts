import { AnyAction } from 'redux';

import {
  SORT_ZINDEXS,
  TOGGLE_ZINDEX_COLLAPSE,
  TOGGLE_ZINDEXS_COLLAPSE,
  SORT_ZINDEXS_WITH_COLLAPSE_CHACHED,
  getZindexConfig,
} from '@/actions/zindex';
import { getSortMode } from '@/actions/sort';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export interface ZindexState {
  zindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[];
}

const sortZindexs = (
  state: ZindexState,
  responseZindexs?: Zindex.ResponseItem[]
): ZindexState => {
  const { zindexs } = state;
  const {
    zindexSortMode: { type: zindexSortType, order: zindexSortorder },
  } = getSortMode();
  const { codeMap } = getZindexConfig();
  const sortList: Zindex.ResponseItem[] = Utils.DeepCopy(
    responseZindexs || zindexs
  );
  sortList.sort((a, b) => {
    const t = zindexSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (zindexSortType) {
      case Enums.ZindexSortType.Zdd:
        return a.zdd > b.zdd ? 1 * t : -1 * t;
      case Enums.ZindexSortType.Zdf:
        return a.zdf > b.zdf ? 1 * t : -1 * t;
      case Enums.ZindexSortType.Zsz:
        return a.zsz > b.zsz ? 1 * t : -1 * t;
      case Enums.ZindexSortType.Custom:
      default:
        return codeMap[a.zindexCode]?.originSort >
          codeMap[b.zindexCode]?.originSort
          ? -1 * t
          : 1 * t;
    }
  });
  return {
    ...state,
    zindexs: sortList,
  };
};

const sortZindexsWithCollapseChached = (
  state: ZindexState,
  responseZindexs: Zindex.ResponseItem[]
): ZindexState => {
  const { zindexs } = state;
  const zindexsCodeToMap = zindexs.reduce((map, zindex) => {
    map[zindex.zindexCode] = zindex;
    return map;
  }, {} as any);

  const zindexsWithCollapseChached = responseZindexs
    .filter((_) => !!_)
    .map((_) => ({
      ..._,
      collapse: zindexsCodeToMap[_?.zindexCode]?.collapse,
    }));

  return sortZindexs(state, zindexsWithCollapseChached);
};

const toggleZindexCollapse = (
  state: ZindexState,
  zindex: Zindex.ResponseItem & Zindex.ExtraRow
): ZindexState => {
  const { zindexs } = state;

  const cloneZindexs = Utils.DeepCopy(zindexs);
  cloneZindexs.forEach((_) => {
    if (_.zindexCode === zindex.zindexCode) {
      _.collapse = !zindex.collapse;
    }
  });
  return {
    ...state,
    zindexs: cloneZindexs,
  };
};

const toggleZindexsCollapse = (state: ZindexState): ZindexState => {
  const { zindexs } = state;
  const cloneZindexs = Utils.DeepCopy(zindexs);
  const expandAllZindexs = zindexs.every((_) => _.collapse);
  cloneZindexs.forEach((_) => {
    _.collapse = !expandAllZindexs;
  });
  return {
    ...state,
    zindexs: cloneZindexs,
  };
};

export default function zindex(
  state = {
    zindexs: [],
  },
  action: AnyAction
) {
  switch (action.type) {
    case SORT_ZINDEXS:
      return sortZindexs(state, action.payload);
    case SORT_ZINDEXS_WITH_COLLAPSE_CHACHED:
      return sortZindexsWithCollapseChached(state, action.payload);
    case TOGGLE_ZINDEX_COLLAPSE:
      return toggleZindexCollapse(state, action.payload);
    case TOGGLE_ZINDEXS_COLLAPSE:
      return toggleZindexsCollapse(state);
    default:
      return state;
  }
}
