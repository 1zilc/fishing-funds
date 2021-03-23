import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';

import Empty from '@/components/Empty';
import FundRow from '@/components/Home/FundList/FundRow';
import { getFunds } from '@/actions/fund';
import styles from './index.scss';

export interface ManageHistoryFundListProps {
  manageHistoryFunds?: Fund.Manager.ManageHistoryFund[];
}
const ManageHistoryFundList: React.FC<ManageHistoryFundListProps> = ({
  manageHistoryFunds,
}) => {
  const [manageHistoryFundList, setManageHistoryFundList] = useState<
    (Fund.ResponseItem & Fund.ExtraRow)[]
  >([]);

  const { run: runGetFunds } = useRequest(getFunds, {
    manual: true,
    throwOnError: true,
    defaultParams: [],
    onSuccess: (res) => {
      setManageHistoryFundList(res.filter((_) => !!_));
    },
  });

  useEffect(() => {
    if (manageHistoryFunds?.length) {
      const funds: Fund.SettingItem[] = manageHistoryFunds?.map(
        ({ name, code }) => ({
          name,
          code,
          cyfe: 0,
        })
      );
      runGetFunds(funds);
    }
  }, [manageHistoryFunds]);

  return (
    <div className={styles.content}>
      {manageHistoryFundList.length ? (
        manageHistoryFundList.map((fund) => (
          <FundRow key={fund.fundcode} fund={fund} readOnly />
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default ManageHistoryFundList;
