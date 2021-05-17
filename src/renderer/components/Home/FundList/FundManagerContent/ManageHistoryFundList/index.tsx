import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';

import Empty from '@/components/Empty';
import FundRow from '@/components/Home/FundList/FundRow';
import { StoreState } from '@/reducers/types';
import { getFunds, getFixFunds, mergeFixFunds, calcFund } from '@/actions/fund';
import { useFixTimeToDo } from '@/utils/hooks';
import styles from './index.scss';
export interface ManageHistoryFundListProps {
  manageHistoryFunds?: Fund.Manager.ManageHistoryFund[];
}
const ManageHistoryFundList: React.FC<ManageHistoryFundListProps> = ({
  manageHistoryFunds = [],
}) => {
  const { autoFreshSetting, freshDelaySetting } = useSelector(
    (state: StoreState) => state.setting.systemSetting
  );
  const [manageHistoryFundList, setManageHistoryFundList] = useState<
    (Fund.ResponseItem & Fund.ExtraRow)[]
  >([]);

  const { run: runGetFunds } = useRequest(getFunds, {
    manual: true,
    throwOnError: true,
    onSuccess: (result: Fund.ResponseItem[]) => {
      const manageHistoryFundList = result
        .filter((_) => !!_)
        .sort((a, b) => Number(b.gszzl) - Number(a.gszzl));
      setManageHistoryFundList(result.filter((_) => !!_));
      runGetFixFunds(manageHistoryFundList);
    },
  });

  const { run: runGetFixFunds } = useRequest(getFixFunds, {
    manual: true,
    throwOnError: true,
    onSuccess: (result: Fund.FixData[]) => {
      const fixFunds = mergeFixFunds(manageHistoryFundList, result);
      const cloneFunds = fixFunds
        .filter((_) => !!_)
        .sort((a, b) => {
          const _a = calcFund(a);
          const _b = calcFund(b);
          return Number(_b.gszzl) - Number(_a.gszzl);
        });
      setManageHistoryFundList(cloneFunds);
    },
  });

  useEffect(() => {
    if (manageHistoryFunds?.length) {
      const funds: Fund.SettingItem[] = manageHistoryFunds?.map(
        ({ name, code }) => ({ name, code, cyfe: 0 })
      );
      runGetFunds(funds);
    }
  }, [manageHistoryFunds]);

  // 间隔时间检查最新净值
  useFixTimeToDo(
    () => autoFreshSetting && runGetFixFunds(manageHistoryFundList),
    freshDelaySetting * 1000 * 60
  );

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
