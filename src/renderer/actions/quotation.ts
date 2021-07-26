import { batch } from 'react-redux';
import { AnyAction } from 'redux';

import { ThunkAction, PromiseAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_QUOTATIONS_LOADING = 'SET_QUOTATIONS_LOADING';
export const SYNC_FAVORITE_QUOTATION_MAP = 'SYNC_FAVORITE_QUOTATION_MAP';
export const SYNC_QUOTATIONS = 'SYNC_QUOTATIONS';

export function syncFavoriteQuotationMapAction(code: string, status: boolean): AnyAction {
  const favoriteQuotationMap = Helpers.Quotation.GetFavoriteQuotationMap();
  favoriteQuotationMap[code] = status;
  Utils.SetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, favoriteQuotationMap);
  return {
    type: SYNC_FAVORITE_QUOTATION_MAP,
    payload: favoriteQuotationMap,
  };
}

export function loadQuotationsAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_QUOTATIONS_LOADING, payload: true });
      const responseQuotations = await Helpers.Quotation.GetQuotations();
      batch(() => {
        dispatch(sortQuotationsCachedAction(responseQuotations));
        dispatch({ type: SET_QUOTATIONS_LOADING, payload: false });
      });
    } catch (error) {
      console.log('加载板块出错', error);
      dispatch({ type: SET_QUOTATIONS_LOADING, payload: false });
    }
  };
}
export function loadQuotationsWithoutLoadingAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      const responseQuotations = await await Helpers.Quotation.GetQuotations();
      dispatch(sortQuotationsCachedAction(responseQuotations));
    } catch (error) {
      console.log('静默加载板块出错', error);
    }
  };
}

export function sortQuotationsCachedAction(responseQuotations: Quotation.ResponseItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        quotation: { quotations },
      } = getState();
      const quotationsCodeToMap = quotations.reduce((map, quotation) => {
        map[quotation.name!] = quotation;
        return map;
      }, {} as any);

      const quotationsWithCollapseChached = responseQuotations.filter(Boolean).map((_) => ({
        ...(quotationsCodeToMap[_.name] || {}),
        ..._,
      }));
      const sortQuotations = Helpers.Quotation.SortQuotations(quotationsWithCollapseChached);
      dispatch(syncQuotationsStateAction(sortQuotations));
    } catch (error) {
      console.log('板块带缓存排序出错', error);
    }
  };
}

export function toggleQuotationCollapse(quotation: Quotation.ResponseItem & Quotation.ExtraRow): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        quotation: { quotations },
      } = getState();
      const cloneQuotations = Utils.DeepCopy(quotations);
      cloneQuotations.forEach((_) => {
        if (_.name === quotation.name) {
          _.collapse = !quotation.collapse;
        }
      });
      dispatch(syncQuotationsStateAction(cloneQuotations));
    } catch (error) {
      console.log('板块展开/折叠出错', error);
    }
  };
}

export function toggleAllQuotationsCollapse(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        quotation: { quotations },
      } = getState();
      const cloneQuotations: (Quotation.ResponseItem & Quotation.ExtraRow)[] = Utils.DeepCopy(quotations);
      const expandAllQuotations = quotations.every((_) => _.collapse);
      cloneQuotations.forEach((_) => {
        _.collapse = !expandAllQuotations;
      });
      dispatch(syncQuotationsStateAction(cloneQuotations));
    } catch (error) {
      console.log('全部板块展开/折叠出错', error);
    }
  };
}

export function sortQuotationsAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        quotation: { quotations },
      } = getState();
      const sortQuotations = Helpers.Quotation.SortQuotations(quotations);
      dispatch(syncQuotationsStateAction(sortQuotations));
    } catch (error) {
      console.log('基金排序错误', error);
    }
  };
}

export function syncQuotationsStateAction(quotations: Quotation.ResponseItem[]): AnyAction {
  return { type: SYNC_QUOTATIONS, payload: quotations };
}
