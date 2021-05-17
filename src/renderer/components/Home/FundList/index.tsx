import React from 'react';
import { useSelector } from 'react-redux';

import FundRow from '@/components/Home/FundList/FundRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import { StoreState } from '@/reducers/types';
import styles from './index.scss';

const FundList: React.FC<{}> = () => {
  const funds = useSelector((state: StoreState) => state.fund.funds);
  const fundsLoading = useSelector(
    (state: StoreState) => state.fund.fundsLoading
  );

  return (
    <div className={styles.container}>
      <LoadingBar show={fundsLoading} />
      {funds.length ? (
        funds.map((fund) => <FundRow key={fund.fundcode} fund={fund} />)
      ) : (
        <Empty text="暂无基金数据~" />
      )}
    </div>
  );
};
export default FundList;
