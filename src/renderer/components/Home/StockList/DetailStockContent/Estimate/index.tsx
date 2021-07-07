import React, { useState } from 'react';
import { useRequest } from 'ahooks';

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
  useRequest(Services.Stock.GetPicTrendFromEastmoney, {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    throwOnError: true,
    defaultParams: [secid],
    onSuccess: setEstimate,
    cacheKey: `GetPicTrendFromEastmoney/${secid}`,
  });

  return (
    <div className={styles.estimate}>
      <img src={estimate || PictureFailedImage} />
    </div>
  );
};

export default Estimate;
