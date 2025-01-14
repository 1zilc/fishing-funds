import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@/services';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface EstimateProps {
  code: string;
}
const Estimate: React.FC<EstimateProps> = React.memo(({ code }) => {
  const [estimate, setEstimate] = useState<string | undefined>('');
  const { run: runGetEstimatedFromEastmoney } = useRequest(() => Services.Quotation.GetMainFundFromEastmoney(code), {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    onSuccess: setEstimate,
  });

  return (
    <ChartCard onFresh={runGetEstimatedFromEastmoney} auto>
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
});

export default Estimate;
