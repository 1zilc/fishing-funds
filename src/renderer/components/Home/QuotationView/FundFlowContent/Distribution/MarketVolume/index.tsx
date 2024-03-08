import React, { useImperativeHandle } from 'react';
import { useRequest } from 'ahooks';
import NP from 'number-precision';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface MarketVolumeProps {}
export type MarketVolumeRef = {
  refresh: () => void;
};

const MarketVolume = React.forwardRef<MarketVolumeRef, MarketVolumeProps>((props, ref) => {
  const { data = [], run: runGet2MarketVolume } = useRequest(Services.Quotation.Get2MarketVolume, {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    cacheKey: Utils.GenerateRequestKey('Services.Quotation.Get2MarketVolume'),
  });

  const [shangzheng = 0, shenzheng = 0] = data;
  const total = NP.plus(shangzheng, shenzheng);

  useImperativeHandle(ref, () => ({
    refresh: runGet2MarketVolume,
  }));

  return (
    <div className={styles.content}>
      <div>上证: {Utils.ConvertBigNum(shangzheng, 2)}</div>
      <div>深证: {Utils.ConvertBigNum(shenzheng, 2)}</div>
      <div>合计: {Utils.ConvertBigNum(total, 2)}</div>
    </div>
  );
});

export default MarketVolume;
