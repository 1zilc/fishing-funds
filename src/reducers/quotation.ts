import { AnyAction } from 'redux';

import {
  SORT_QUOTATIONS,
  TOGGLE_QUOTATION_COLLAPSE,
  TOGGLE_QUOTATIONS_COLLAPSE,
  SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED,
} from '@/actions/quotation';
import { getSortMode } from '@/actions/sort';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export interface QuotationState {
  quotations: (Quotation.ResponseItem & Quotation.ExtraRow)[];
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
        return Number(a.zde) > Number(b.zde) ? 1 * t : -1 * t;
      case Enums.QuotationSortType.Zsz:
        return Number(a.zsz) > Number(b.zsz) ? 1 * t : -1 * t;
      case Enums.QuotationSortType.Zxj:
        return Number(a.zxj) > Number(b.zxj) ? 1 * t : -1 * t;
      case Enums.QuotationSortType.Szjs:
        return Number(a.szjs) > Number(b.szjs) ? 1 * t : -1 * t;
      case Enums.QuotationSortType.Xdjs:
        return Number(a.xdjs) > Number(b.xdjs) ? 1 * t : -1 * t;
      case Enums.QuotationSortType.Zdf:
      default:
        return Number(a.zdf) > Number(b.zdf) ? 1 * t : -1 * t;
    }
  });

  return {
    ...state,
    quotations: sortList,
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
      ..._,
      collapse: quotationsCodeToMap[_!.name!]?.collapse,
    }));

  return sortQuotations(state, quotationsWithCollapseChached);
}

function toggleQuotationCollapse(
  state: QuotationState,
  quotation: Quotation.ResponseItem & Quotation.ExtraRow
): QuotationState {
  const { quotations } = state;
  const cloneQuotations: (Quotation.ResponseItem &
    Quotation.ExtraRow)[] = Utils.DeepCopy(quotations);
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
  const cloneQuotations: (Quotation.ResponseItem &
    Quotation.ExtraRow)[] = Utils.DeepCopy(quotations);
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
    remoteQuotations: [],
  },
  action: AnyAction
) {
  switch (action.type) {
    case SORT_QUOTATIONS:
      return sortQuotations(state, action.payload);
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
