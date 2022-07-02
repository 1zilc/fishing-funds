import { DetailFund } from '@//components/Home/FundView/DetailFundContent';
import GlobalStyles from '@/components/GlobalStyles';

import {} from '@/utils/hooks';

const DetailPage = () => {
  return (
    <>
      <GlobalStyles />
      <DetailFund code="001314" />
    </>
  );
};

export default DetailPage;
