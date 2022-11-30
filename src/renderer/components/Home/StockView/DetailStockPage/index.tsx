import React from 'react';
import { DetailStock, DetailStockProps } from '@/components/Home/StockView/DetailStockContent';
import { useRouterParams } from '@/utils/hooks';

export type DetailStockPageParams = DetailStockProps;

const DetailStockPage: React.FC = () => {
  const params: DetailStockPageParams = useRouterParams();

  return <DetailStock {...params} />;
};

export default DetailStockPage;
