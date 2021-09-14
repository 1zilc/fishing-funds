import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import PictureImage from '@/assets/img/picture.svg';
import PictureFailedImage from '@/assets/img/picture-failed.svg';
import * as Services from '@/services';
import * as CONST from '@/constants';
import styles from './index.scss';

export interface EstimateProps {
  secid: string;
}
const Estimate: React.FC<EstimateProps> = ({ secid }) => {
  const [estimate, setEstimate] = useState(PictureImage);
  const { run: runGetPicTrendFromEastmoney } = useRequest(() => Services.Stock.GetPicTrendFromEastmoney(secid), {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    throwOnError: true,
    onSuccess: setEstimate,
    cacheKey: `GetPicTrendFromEastmoney/${secid}`,
    refreshDeps: [secid],
  });

  return (
    <ChartCard onFresh={runGetPicTrendFromEastmoney}>
      <div className={styles.estimate}>
        <img src={estimate || PictureFailedImage} />
      </div>
    </ChartCard>
  );
};

export default Estimate;
