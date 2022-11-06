import React from 'react';
import { DetailFund, DetailFundProps } from '@/components/Home/FundView/DetailFundContent';
import { useRouterParams } from '@/utils/hooks';

export type DetailFundPageParams = DetailFundProps;

const DetailFundPage: React.FC = () => {
  const params: DetailFundPageParams = useRouterParams();

  return <DetailFund {...params} />;
};

export default DetailFundPage;
