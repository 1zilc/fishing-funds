import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';

import Empty from '@/components/Empty';
import FundRow from '@/components/Home/FundList/FundRow';
import { getFunds } from '@/actions/fund';
import styles from './index.scss';

export interface SameFundListProps {
  swithSameType?: string[][];
}
const SameFundList: React.FC<SameFundListProps> = ({ swithSameType }) => {
  const [sameFunds, setSameFunds] = useState<
    (Fund.ResponseItem & Fund.ExtraRow)[]
  >([]);

  const { run: getSameFunds } = useRequest(getFunds, {
    manual: true,
    throwOnError: true,
    onSuccess: (result: Fund.ResponseItem[]) => {
      setSameFunds(
        result
          .filter((_) => !!_)
          .sort((a, b) => {
            return Number(b.gszzl) - Number(a.gszzl);
          })
      );
    },
  });

  useEffect(() => {
    if (swithSameType?.length) {
      const hash: string[] = [];
      const funds: Fund.SettingItem[] = [];
      swithSameType.flat().forEach((sameFund) => {
        const [code, name, value] = sameFund.split('_');
        if (hash.indexOf(code) < 0) {
          funds.push({
            code: code,
            cyfe: 0,
          });
          hash.push(code);
        }
      });
      getSameFunds(funds);
    }
  }, [swithSameType]);

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
