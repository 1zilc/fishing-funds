import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import FundRow from '@/components/FundRow';
import Empty from '@/components/Empty';
import { HomeContext } from '@/components/Home';
import { getSystemSetting } from '@/actions/setting';
import { StoreState } from '@/reducers/types';
import { useWorkDayTimeToDo } from '@/utils/hooks';

import styles from './index.scss';

const FundList = () => {
  const { freshDelaySetting, autoFreshSetting } = getSystemSetting();
  const funds = useSelector((state: StoreState) => state.fund.funds);
  const { runGetFunds } = useContext(HomeContext);

  // 间隔时间刷新基金
  useWorkDayTimeToDo(
    () => autoFreshSetting && runGetFunds(),
    freshDelaySetting * 1000 * 60
  );

  useEffect(() => {
    runGetFunds();
  }, []);

  return (
    <div className={styles.container}>
      {funds.length ? (
        funds.map((fund) => <FundRow key={fund.fundcode} fund={fund} />)
      ) : (
        <Empty text="暂无基金数据~" />
      )}
    </div>
  );
};
export default FundList;
