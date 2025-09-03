import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@/services';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.css';

export interface EstimateProps {
  secid: string;
}
const Estimate: React.FC<EstimateProps> = ({ secid }) => {
  const [estimate, setEstimate] = useState<string | undefined>('');
  const { run: runGetPicTrendFromEastmoney } = useRequest(() => Services.Zindex.GetPicTrendFromEastmoney(secid), {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    onSuccess: setEstimate,
    refreshDeps: [secid],
  });

  return (
    <ChartCard onFresh={runGetPicTrendFromEastmoney}>
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
