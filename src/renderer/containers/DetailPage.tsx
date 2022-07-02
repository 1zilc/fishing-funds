import { DetailFund } from '@//components/Home/FundView/DetailFundContent';
import GlobalStyles from '@/components/GlobalStyles';

import { useShareStoreState } from '@/utils/hooks';

const DetailPage = () => {
  useShareStoreState();
  return (
    <>
      <GlobalStyles />
      <DetailFund code="001314" />
    </>
  );
};

export default DetailPage;
