import React from 'react';
import { DetailCoin, DetailCoinProps } from '@/components/Home/CoinView/DetailCoinContent';
import { useRouterParams } from '@/utils/hooks';

export type DetailCoinPageParams = DetailCoinProps;

const DetailCoinPage: React.FC = () => {
  const params: DetailCoinPageParams = useRouterParams();

  return <DetailCoin {...params} />;
};

export default DetailCoinPage;
