import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import PictureImage from '@/static/img/picture.svg';
import PictureFailedImage from '@/static/img/picture-failed.svg';
import * as Services from '@/services';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export interface InvestStyleProps {
  code: string;
}
const InvestStyle: React.FC<InvestStyleProps> = ({ code }) => {
  const [estimate, setEstimate] = useState(PictureImage);
  const { run: runGetInverstStyleFromEastmoney } = useRequest(() => Services.Fund.GetInverstStyleFromEastmoney(code), {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,

    onSuccess: setEstimate,
    refreshDeps: [code],
  });

  return (
    <ChartCard onFresh={runGetInverstStyleFromEastmoney}>
      <div className={styles.estimate}>
        <img src={estimate || PictureFailedImage} />
      </div>
    </ChartCard>
  );
};

export default InvestStyle;
