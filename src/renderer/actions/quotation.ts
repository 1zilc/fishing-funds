import { batch } from 'react-redux';

import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import { Dispatch, GetState } from '@/reducers/types';

export const SORT_QUOTATIONS = 'SORT_QUOTATIONS';
export const SET_QUOTATIONS_LOADING = 'SET_QUOTATIONS_LOADING';
export const TOGGLE_QUOTATION_COLLAPSE = 'TOGGLE_QUOTATION_COLLAPSE';
export const TOGGLE_QUOTATIONS_COLLAPSE = 'TOGGLE_QUOTATIONS_COLLAPSE';
export const SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED =
  'SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED';

export async function getQuotations() {
  return Services.Quotation.GetQuotationsFromEastmoney();
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
    } finally {
    }
  };
}
