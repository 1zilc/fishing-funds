import { batch } from 'react-redux';
import { store } from '@/.';
import { SET_QUOTATIONS_LOADING, sortQuotationsCachedAction } from '@/actions/quotation';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export async function GetQuotations() {
  return Services.Quotation.GetQuotationsFromEastmoney();
}

export function SortQuotations(responseQuotations: Quotation.ResponseItem[]) {
  const {
    sort: {
      sortMode: {
        quotationSortMode: { type: quotationSortType, order: quotationSortorder },
      },
    },
  } = store.getState();

  const sortList: Quotation.ResponseItem[] = Utils.DeepCopy(responseQuotations);

  sortList.sort((a, b) => {
    const t = quotationSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (quotationSortType) {
      case Enums.QuotationSortType.Zde:
        return (Number(a.zde) - Number(b.zde)) * t;
      case Enums.QuotationSortType.Zdd:
        return (Number(a.zdd) - Number(b.zdd)) * t;
      case Enums.QuotationSortType.Zsz:
        return (Number(a.zsz) - Number(b.zsz)) * t;
      case Enums.QuotationSortType.Zxj:
        return (Number(a.zxj) - Number(b.zxj)) * t;
      case Enums.QuotationSortType.Szjs:
        return (Number(a.szjs) - Number(b.szjs)) * t;
      case Enums.QuotationSortType.Xdjs:
        return (Number(a.xdjs) - Number(b.xdjs)) * t;
      case Enums.QuotationSortType.Name:
        return b.name.localeCompare(a.name, 'zh') * t;
      case Enums.QuotationSortType.Zdf:
      default:
        return (Number(a.zdf) - Number(b.zdf)) * t;
    }
  });

  return sortList;
}

export async function LoadQuotations(loading?: boolean) {
  try {
    store.dispatch({ type: SET_QUOTATIONS_LOADING, payload: loading && true });
    const responseQuotations = await GetQuotations();
    batch(() => {
      store.dispatch(sortQuotationsCachedAction(responseQuotations));
      store.dispatch({ type: SET_QUOTATIONS_LOADING, payload: false });
    });
  } catch (error) {
    store.dispatch({ type: SET_QUOTATIONS_LOADING, payload: false });
  }
}
