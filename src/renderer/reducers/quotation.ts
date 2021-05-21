import { AnyAction } from 'redux';

import {
  SORT_QUOTATIONS,
  SET_QUOTATIONS_LOADING,
  TOGGLE_QUOTATION_COLLAPSE,
  TOGGLE_QUOTATIONS_COLLAPSE,
  SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED,
} from '@/actions/quotation';
import { getSortMode } from '@/actions/sort';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export interface QuotationState {
  quotations: (Quotation.ResponseItem & Quotation.ExtraRow)[];
  quotationsLoading: boolean;
}

function sortQuotations(
  state: QuotationState,
  responseQuotations?: Quotation.ResponseItem[]
): QuotationState {
  const { quotations } = state;
  const {
    quotationSortMode: { type: quotationSortType, order: quotationSortorder },
  } = getSortMode();
  const sortList: Quotation.ResponseItem[] = Utils.DeepCopy(
    responseQuotations || quotations
  );

  sortList.sort((a, b) => {
    const t = quotationSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (quotationSortType) {
      case Enums.QuotationSortType.Zde:
        return (Number(a.zde) - Number(b.zde)) * t;
      case Enums.QuotationSortType.Zsz:
        return (Number(a.zsz) - Number(b.zsz)) * t;
      case Enums.QuotationSortType.Zxj:
        return (Number(a.zxj) - Number(b.zxj)) * t;
      case Enums.QuotationSortType.Szjs:
        return (Number(a.szjs) - Number(b.szjs)) * t;
      case Enums.QuotationSortType.Xdjs:
        return (Number(a.xdjs) - Number(b.xdjs)) * t;
      case Enums.QuotationSortType.Zdf:
      default:
        return (Number(a.zdf) - Number(b.zdf)) * t;
    }
  });

  return {
    ...state,
    quotations: sortList,
  };
}

function sortQuotationsLoading(state: QuotationState, loading: boolean) {
  return {
    ...state,
    quotationsLoading: loading,
  };
}

function sortQuotationsWithCollapseChached(
  state: QuotationState,
  responseQuotations: Quotation.ResponseItem[]
): QuotationState {
  const { quotations } = state;
  const quotationsCodeToMap = quotations.reduce((map, quotation) => {
    map[quotation.name!] = quotation;
    return map;
  }, {} as any);

  const quotationsWithCollapseChached = responseQuotations
    .filter((_) => !!_)
    .map((_) => ({
      ...(quotationsCodeToMap[_.name] || {}),
      ..._,
    }));

  return sortQuotations(state, quotationsWithCollapseChached);
}

function toggleQuotationCollapse(
  state: QuotationState,
  quotation: Quotation.ResponseItem & Quotation.ExtraRow
): QuotationState {
  const { quotations } = state;
  const cloneQuotations: (Quotation.ResponseItem & Quotation.ExtraRow)[] =
    Utils.DeepCopy(quotations);
  cloneQuotations.forEach((_) => {
    if (_.name === quotation.name) {
      _.collapse = !quotation.collapse;
    }
  });
  return {
    ...state,
    quotations: cloneQuotations,
  };
}

function toggleQuotationsCollapse(state: QuotationState): QuotationState {
  const { quotations } = state;
  const cloneQuotations: (Quotation.ResponseItem & Quotation.ExtraRow)[] =
    Utils.DeepCopy(quotations);
  const expandAllQuotations = quotations.every((_) => _.collapse);
  cloneQuotations.forEach((_) => {
    _.collapse = !expandAllQuotations;
  });
  return {
    ...state,
    quotations: cloneQuotations,
  };
}

export default function quotation(
  state = {
    quotations: [],
    quotationsLoading: false,
  },
  action: AnyAction
) {
  switch (action.type) {
    case SORT_QUOTATIONS:
      return sortQuotations(state, action.payload);
    case SET_QUOTATIONS_LOADING:
      return sortQuotationsLoading(state, action.payload);
    case SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED:
      return sortQuotationsWithCollapseChached(state, action.payload);
    case TOGGLE_QUOTATION_COLLAPSE:
      return toggleQuotationCollapse(state, action.payload);
    case TOGGLE_QUOTATIONS_COLLAPSE:
      return toggleQuotationsCollapse(state);
    default:
      return state;
  }
}
