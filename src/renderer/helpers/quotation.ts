import * as Services from '@/services';

export async function GetQuotations() {
  return Services.Quotation.GetQuotationsFromEastmoney();
}
