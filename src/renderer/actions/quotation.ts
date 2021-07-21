import { batch } from 'react-redux';

import { Dispatch, GetState } from '@/reducers/types';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export const SORT_QUOTATIONS = 'SORT_QUOTATIONS';
export const SET_QUOTATIONS_LOADING = 'SET_QUOTATIONS_LOADING';
export const TOGGLE_QUOTATION_COLLAPSE = 'TOGGLE_QUOTATION_COLLAPSE';
export const TOGGLE_QUOTATIONS_COLLAPSE = 'TOGGLE_QUOTATIONS_COLLAPSE';
export const SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED =
  'SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED';
export const SYNC_FAVORITE_QUOTATION_MAP = 'SYNC_FAVORITE_QUOTATION_MAP';

export async function getQuotations() {
  return Services.Quotation.GetQuotationsFromEastmoney();
}

export function syncFavoriteQuotationMap(code: string, status: boolean) {
  const favoriteQuotationMap = getFavoriteQuotationMap();
  favoriteQuotationMap[code] = status;
  Utils.SetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, favoriteQuotationMap);
  return {
    type: SYNC_FAVORITE_QUOTATION_MAP,
    payload: favoriteQuotationMap,
  };
}

export function getFavoriteQuotationMap() {
  return Utils.GetStorage(
    CONST.STORAGE.FAVORITE_QUOTATION_MAP,
    {} as { [index: string]: boolean }
  );
}

export function loadQuotations() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_QUOTATIONS_LOADING, payload: true });
      const quotations = await getQuotations();
      batch(() => {
        dispatch({
          type: SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED,
          payload: quotations,
        });
        dispatch({ type: SET_QUOTATIONS_LOADING, payload: false });
      });
    } catch {
      dispatch({ type: SET_QUOTATIONS_LOADING, payload: false });
    }
  };
}
export function loadQuotationsWithoutLoading() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const quotations = await getQuotations();
      batch(() => {
        dispatch({
          type: SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED,
          payload: quotations,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
}
