import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';

import Empty from '@/components/Empty';
import FundRow from '@/components/Home/FundList/FundRow';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import CustomDrawer from '@/components/CustomDrawer';
import { getFunds, getFixFunds, mergeFixFunds, calcFund } from '@/actions/fund';
import { useFixTimeToDo, useDrawer } from '@/utils/hooks';
import { StoreState } from '@/reducers/types';
import styles from './index.scss';

export interface SameFundListProps {
  swithSameType: string[][];
}
const SameFundList: React.FC<SameFundListProps> = ({ swithSameType = [] }) => {
  const { autoFreshSetting, freshDelaySetting } = useSelector(
    (state: StoreState) => state.setting.systemSetting
  );
  const [sameFunds, setSameFunds] = useState<
    (Fund.ResponseItem & Fund.ExtraRow)[]
  >([]);

  const {
    data: detailFundCode,
    show: showDetailDrawer,
    set: setDetailDrawer,
    close: closeDetailDrawer,
  } = useDrawer('');

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
          <FundRow
            key={fund.fundcode}
            readOnly
            fund={fund}
            onDetail={setDetailDrawer}
          />
        ))
      ) : (
        <Empty text="暂无同类型基金数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent
          onEnter={closeDetailDrawer}
          onClose={closeDetailDrawer}
          code={detailFundCode}
        />
      </CustomDrawer>
    </div>
  );
};

export default SameFundList;
