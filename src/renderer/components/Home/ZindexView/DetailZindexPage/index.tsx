import React from 'react';
import { DetailZindex, DetailFundProps } from '@/components/Home/ZindexView/DetailZindexContent';
import { useRouterParams } from '@/utils/hooks';

export type DetailZindexPageParams = DetailFundProps;

const DetailZindexPage: React.FC = () => {
  const params: DetailZindexPageParams = useRouterParams();

  return <DetailZindex {...params} />;
};

export default DetailZindexPage;
