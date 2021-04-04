import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import PictureImage from '@/assets/img/picture.svg';
import * as Services from '@/services';
import styles from './index.scss';

export interface EstimateProps {
  code: string;
}
const pollingInterval = 1000 * 60 * 5;
const Estimate: React.FC<EstimateProps> = ({ code }) => {
  const [estimate, setEstimate] = useState(PictureImage);
  useRequest(Services.Fund.GetEstimatedFromEastmoney, {
    pollingInterval,
    throwOnError: true,
    defaultParams: [code],
    onSuccess: setEstimate,
    cacheKey: `GetEstimatedFromEastmoney/${code}`,
  });

  return (
    <div className={styles.estimate}>
      <img src={estimate} />
    </div>
  );
};

export default Estimate;
