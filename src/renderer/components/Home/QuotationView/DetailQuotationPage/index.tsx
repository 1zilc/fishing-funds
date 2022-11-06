import React from 'react';
import { DetailQuotation, DetailQuotationProps } from '@/components/Home/QuotationView/DetailQuotationContent';
import { useRouterParams } from '@/utils/hooks';

export type DetailQuotationPageParams = DetailQuotationProps;

const DetailQuotationPage: React.FC = () => {
  const params: DetailQuotationPageParams = useRouterParams();

  return <DetailQuotation {...params} />;
};

export default DetailQuotationPage;
