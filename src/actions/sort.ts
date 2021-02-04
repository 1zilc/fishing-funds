import NP from 'number-precision';
import * as Services from '../services';
import * as Enums from '../utils/enums';
import * as Utils from '../utils';
import * as Adapter from '../utils/adpters';
import { getFundApiTypeSetting } from './setting';
import CONST_STORAGE from '../constants/storage.json';

export interface SortMode {
  type: Enums.SortType;
  order: Enums.SortOrderType;
}
export const sortModeOptions: Option.EnumsOption<Enums.SortType>[] = [
  { key: Enums.SortType.Default, value: '默认' },
  { key: Enums.SortType.Growth, value: '今日涨幅' },
  { key: Enums.SortType.Block, value: '持有份额' },
  { key: Enums.SortType.Money, value: '今日收益' },
  { key: Enums.SortType.Estimate, value: '今日估值' },
];

export const getSortConfig = () => {
  const sortModeOptionsMap = sortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as any);
  return { sortModeOptions, sortModeOptionsMap };
};

export const getSortMode: () => SortMode = () => {
  const sortMode = Utils.GetStorage(CONST_STORAGE.SORT_MODE, {
    type: Enums.SortType.Default,
    order: Enums.SortOrderType.Desc,
  });
  return sortMode;
};

export const setSortMode: (sortMode: {
  type?: Enums.SortType;
  order?: Enums.SortOrderType;
}) => void = (sortMode) => {
  const _sortMode = getSortMode();
  Utils.SetStorage(CONST_STORAGE.SORT_MODE, {
    ..._sortMode,
    ...sortMode,
  });
};

export const troggleSortOrder = () => {
  const sortMode = getSortMode();
  const { order } = sortMode;
  Utils.SetStorage(CONST_STORAGE.SORT_MODE, {
    ...sortMode,
    order:
      order === Enums.SortOrderType.Asc
        ? Enums.SortOrderType.Desc
        : Enums.SortOrderType.Asc,
  });
};
