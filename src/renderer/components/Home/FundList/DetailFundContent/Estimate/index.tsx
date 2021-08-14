import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import PictureImage from '@/assets/img/picture.svg';
import PictureFailedImage from '@/assets/img/picture-failed.svg';
import * as Services from '@/services';
import * as CONST from '@/constants';
import styles from './index.scss';

export interface EstimateProps {
  code: string;
}
const Estimate: React.FC<EstimateProps> = ({ code }) => {
  const [estimate, setEstimate] = useState(PictureImage);
  const { run: runGetEstimatedFromEastmoney } = useRequest(Services.Fund.GetEstimatedFromEastmoney, {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    throwOnError: true,
    defaultParams: [code],
    onSuccess: setEstimate,
    cacheKey: `GetEstimatedFromEastmoney/${code}`,
  });

  const freshChart = useCallback(() => {
    runGetEstimatedFromEastmoney(code);
  }, [code]);

  return (
    <ChartCard onFresh={freshChart}>
      <div className={styles.estimate}>
        <img src={estimate || PictureFailedImage} />
      </div>
    </ChartCard>
  );
};

export default Estimate;
