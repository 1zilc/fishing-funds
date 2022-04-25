import { TypedThunk } from '@/store';
import { syncFavoriteQuotationMap, syncQuotations } from '@/store/features/quotation';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export function syncFavoriteQuotationMapAction(code: string, status: boolean): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const { quotation } = getState();
      const favoriteQuotationMap = { ...quotation.favoriteQuotationMap, [code]: status };

      await Utils.SetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, favoriteQuotationMap);

      dispatch(syncFavoriteQuotationMap(favoriteQuotationMap));
    } catch (error) {}
  };
}

export function sortQuotationsCachedAction(responseQuotations: Quotation.ResponseItem[]): TypedThunk {
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

export function toggleQuotationCollapse(quotation: Quotation.ResponseItem & Quotation.ExtraRow): TypedThunk {
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

export function toggleAllQuotationsCollapse(): TypedThunk {
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

export function sortQuotationsAction(): TypedThunk {
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

export function syncQuotationsStateAction(quotations: Quotation.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(syncQuotations(quotations));
    } catch (error) {}
  };
}
