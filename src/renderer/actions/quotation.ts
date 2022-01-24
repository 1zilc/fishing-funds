import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_QUOTATIONS_LOADING = 'SET_QUOTATIONS_LOADING';
export const SYNC_FAVORITE_QUOTATION_MAP = 'SYNC_FAVORITE_QUOTATION_MAP';
export const SYNC_QUOTATIONS = 'SYNC_QUOTATIONS';

export function syncFavoriteQuotationMapAction(code: string, status: boolean): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const { quotation } = getState();

      const favoriteQuotationMap = { ...quotation.favoriteQuotationMap, [code]: status };

      dispatch({ type: SYNC_FAVORITE_QUOTATION_MAP, payload: favoriteQuotationMap });

      Utils.SetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, favoriteQuotationMap);
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
  };
}

export function syncQuotationsStateAction(quotations: Quotation.ResponseItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: SYNC_QUOTATIONS, payload: quotations });
    } catch (error) {}
  };
}
