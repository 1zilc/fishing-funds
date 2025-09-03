import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@/services';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.css';

export interface EstimateProps {
  code: string;
}
const Estimate: React.FC<EstimateProps> = ({ code }) => {
  const [estimate, setEstimate] = useState<string | undefined>('');
  const { run: runGetEstimatedFromEastmoney } = useRequest(() => Services.Fund.GetEstimatedFromEastmoney(code), {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    onSuccess: setEstimate,
    refreshDeps: [code],
  });

  return (
    <ChartCard onFresh={runGetEstimatedFromEastmoney}>
      <div className={styles.estimate}>
        {estimate === '' ? (
          <img src="img/picture.svg" />
        ) : estimate === undefined ? (
          <img src="img/picture-failed.svg" />
        ) : (
          <img src={estimate} onError={() => setEstimate(undefined)} />
        )}
      </div>
    </ChartCard>
  );
};

export default Estimate;
