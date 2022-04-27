import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';

import Empty from '@/components/Empty';
import FundRow from '@/components/Home/FundView/FundRow';
import CustomDrawer from '@/components/CustomDrawer';

import { useFixTimeToDo, useDrawer, useAppSelector } from '@/utils/hooks';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

const DetailFundContent = React.lazy(() => import('@/components/Home/FundView/DetailFundContent'));

export interface ManageHistoryFundListProps {
  manageHistoryFunds?: Fund.Manager.ManageHistoryFund[];
}
const ManageHistoryFundList: React.FC<ManageHistoryFundListProps> = ({ manageHistoryFunds = [] }) => {
  const { autoFreshSetting, freshDelaySetting, fundApiTypeSetting } = useAppSelector((state) => state.setting.systemSetting);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const [manageHistoryFundList, setManageHistoryFundList] = useState<(Fund.ResponseItem & Fund.ExtraRow)[]>([]);
  const { data: detailFundCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const { run: runGetFunds } = useRequest((config: Fund.SettingItem[]) => Helpers.Fund.GetFunds(config, fundApiTypeSetting), {
    manual: true,

    onSuccess: (result: Fund.ResponseItem[]) => {
      const manageHistoryFundList = result.filter(Boolean).sort((a, b) => Number(b.gszzl) - Number(a.gszzl));
      setManageHistoryFundList(result.filter(Boolean));
      runGetFixFunds(manageHistoryFundList);
    },
  });

  const { run: runGetFixFunds } = useRequest(Helpers.Fund.GetFixFunds, {
    manual: true,

    onSuccess: (result) => {
      const fixFunds = Helpers.Fund.MergeFixFunds(manageHistoryFundList, result);
      const cloneFunds = fixFunds.filter(Boolean).sort((a, b) => {
        const calcA = Helpers.Fund.CalcFund(a, fundConfigCodeMap);
        const calcB = Helpers.Fund.CalcFund(b, fundConfigCodeMap);
        return Number(calcB.gszzl) - Number(calcA.gszzl);
      });
      setManageHistoryFundList(cloneFunds);
    },
  });

  useEffect(() => {
    if (manageHistoryFunds?.length) {
      const funds: Fund.SettingItem[] = manageHistoryFunds?.map(({ name, code }) => ({ name, code, cyfe: 0 }));
      runGetFunds(funds);
    }
  }, [manageHistoryFunds]);

  // 间隔时间检查最新净值
  useFixTimeToDo(() => autoFreshSetting && runGetFixFunds(manageHistoryFundList), freshDelaySetting * 1000 * 60);

  return (
    <div className={styles.content}>
      {manageHistoryFundList.length ? (
        manageHistoryFundList.map((fund) => <FundRow key={fund.fundcode} readOnly fund={fund} onDetail={setDetailDrawer} />)
      ) : (
        <Empty text="暂无管理基金数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailFundCode} />
      </CustomDrawer>
    </div>
  );
};

export default ManageHistoryFundList;
