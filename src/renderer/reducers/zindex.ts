import { AnyAction } from 'redux';

import { SYNC_ZIDNEXS, SET_ZINDEXS_LOADING, SYNC_ZIDNEX_CONFIG } from '@/actions/zindex';

import { Reducer } from '@/reducers/types';
import * as Helpers from '@/helpers';

export interface ZindexState {
  zindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[];
  zindexsLoading: boolean;
  config: { zindexConfig: Zindex.SettingItem[]; codeMap: Helpers.Zindex.CodeZindexMap; selectZindexs: string[] };
}

const zindex: Reducer<ZindexState> = (
  state = {
    zindexs: [],
    zindexsLoading: false,
    config: Helpers.Zindex.GetZindexConfig(),
  },
  action
) => {
  switch (action.type) {
    case SET_ZINDEXS_LOADING:
      return {
        ...state,
        zindexsLoading: action.payload,
      };
    case SYNC_ZIDNEXS:
      return {
        ...state,
        zindexs: action.payload,
      };
    case SYNC_ZIDNEX_CONFIG:
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
};
export default zindex;
