import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import PictureImage from '@/static/img/picture.svg';
import PictureFailedImage from '@/static/img/picture-failed.svg';
import * as Services from '@/services';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export interface EstimateProps {
  code: string;
}
const Estimate: React.FC<EstimateProps> = ({ code }) => {
  const [estimate, setEstimate] = useState<string | undefined>('');
  const { run: runGetEstimatedFromEastmoney } = useRequest(() => Services.Quotation.GetMainFundFromEastmoney(code), {
    pollingInterval: 1000 * 60 * 1,
    onSuccess: setEstimate,
  });

  return (
    <ChartCard onFresh={runGetEstimatedFromEastmoney} auto>
      <div className={styles.estimate}>
        {estimate === '' ? (
          <PictureImage />
        ) : estimate === undefined ? (
          <PictureFailedImage />
        ) : (
          <img src={estimate} onError={() => setEstimate(undefined)} />
        )}
      </div>
    </ChartCard>
  );
};

export default Estimate;
