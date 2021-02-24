import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import PictureImage from '@/assets/img/picture.svg';
import * as Services from '@/services';
import styles from './index.scss';

export interface EstimateProps {
  code: string;
}

const Estimate: React.FC<EstimateProps> = ({ code }) => {
  const [estimate, setEstimate] = useState(PictureImage);
  useRequest(Services.Fund.GetEstimatedFromEastmoney, {
    throwOnError: true,
    defaultParams: [code],
    onSuccess: setEstimate,
  });

  return (
    <div className={styles.estimate}>
      <img src={estimate} />
    </div>
  );
};

export default Estimate;
