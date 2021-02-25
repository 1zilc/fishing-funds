import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';

export const SORT_QUOTATIONS = 'SORT_QUOTATIONS';
export const TOGGLE_QUOTATION_COLLAPSE = 'TOGGLE_QUOTATION_COLLAPSE';
export const TOGGLE_QUOTATIONS_COLLAPSE = 'TOGGLE_QUOTATIONS_COLLAPSE';
export const SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED =
  'SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED';

export async function getQuotations() {
  await Utils.Sleep(1000);
  return Services.Quotation.GetQuotationsFromEastmoney();
}
