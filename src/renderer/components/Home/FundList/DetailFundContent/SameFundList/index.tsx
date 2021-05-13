import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';

import Empty from '@/components/Empty';
import FundRow from '@/components/Home/FundList/FundRow';
import { getFunds, getFixFunds, mergeFixFunds, calcFund } from '@/actions/fund';
import { getSystemSetting } from '@/actions/setting';
import { useFixTimeToDo } from '@/utils/hooks';
import styles from './index.scss';

export interface SameFundListProps {
  swithSameType: string[][];
}
const SameFundList: React.FC<SameFundListProps> = ({ swithSameType = [] }) => {
  const { freshDelaySetting, autoFreshSetting } = getSystemSetting();
  const [sameFunds, setSameFunds] = useState<
    (Fund.ResponseItem & Fund.ExtraRow)[]
  >([]);

  const { run: runGetFunds } = useRequest(getFunds, {
    manual: true,
    throwOnError: true,
    onSuccess: (result: Fund.ResponseItem[]) => {
      const sameFunds = result
        .filter((_) => !!_)
        .sort((a, b) => Number(b.gszzl) - Number(a.gszzl));
      setSameFunds(sameFunds);
      runGetFixFunds(sameFunds);
    },
  });

  const { run: runGetFixFunds } = useRequest(getFixFunds, {
    manual: true,
    throwOnError: true,
    onSuccess: (result: Fund.FixData[]) => {
      const fixFunds = mergeFixFunds(sameFunds, result);
      const cloneFunds = fixFunds
        .filter((_) => !!_)
        .sort((a, b) => {
          const _a = calcFund(a);
          const _b = calcFund(b);
          return Number(_b.gszzl) - Number(_a.gszzl);
        });
      setSameFunds(cloneFunds);
    },
  });

  useEffect(() => {
    if (swithSameType?.length) {
      const hash: string[] = [];
      const funds: Fund.SettingItem[] = [];
      swithSameType.flat().forEach((sameFund) => {
        const [code, name, value] = sameFund.split('_');
        if (hash.indexOf(code) < 0) {
          funds.push({ code, name, cyfe: 0 });
          hash.push(code);
        }
      });
      runGetFunds(funds);
    }
  }, [swithSameType]);

  // 间隔时间检查最新净值
  useFixTimeToDo(
    () => autoFreshSetting && runGetFixFunds(sameFunds),
    freshDelaySetting * 1000 * 60
  );

  return (
    <div className={styles.content}>
      {sameFunds.length ? (
        sameFunds.map((fund) => (
          <FundRow key={fund.fundcode} fund={fund} readOnly />
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default SameFundList;
