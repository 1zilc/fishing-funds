import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import TypeSelection from '@/components/TypeSelection';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.scss';

export interface PerformanceProps {
  code: string;
}

const intervalTypeList = [
  { name: '1天', type: 'd1', code: 'd1' },
  { name: '1分钟', type: 'm1', code: 'm1' },
  { name: '5分钟', type: 'm5', code: 'm5' },
  { name: '15分钟', type: 'm15', code: 'm15' },
  { name: '30分钟', type: 'm30', code: 'm30' },
  { name: '1小时', type: 'h1', code: 'h1' },
  { name: '2小时', type: 'h2', code: 'h2' },
  { name: '6小时', type: 'h6', code: 'h6' },
  { name: '12小时', type: 'h12', code: 'h12' },
];

const Trend: React.FC<PerformanceProps> = ({ code }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [interval, setInterval] = useState(intervalTypeList[0]);
  const { darkMode } = useHomeContext();
  const { run: runGetHistoryFromCoinCap } = useRequest(Services.Coin.GetHistoryFromCoinCap, {
    manual: true,
    throwOnError: true,
    cacheKey: `GetHistoryFromCoinCap/${code}`,
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    onSuccess: (result) => {
      chartInstance?.setOption({
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          position: 'inside',
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          top: 25,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          data: result.map(({ time, priceUsd }) => time),
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}`,
            fontSize: 10,
          },
          scale: true,
        },
        series: [
          {
            data: result.map(({ time, priceUsd }) => [time, priceUsd]),
            type: 'line',
            name: '价格$',
            showSymbol: false,
            symbol: 'none',
            smooth: true,
            markPoint: {
              symbol: 'pin',
              symbolSize: 30,
              data: [
                { type: 'max', label: { fontSize: 10 } },
                { type: 'min', label: { fontSize: 10 } },
              ],
            },
          },
        ],
      });
    },
  });

  useRenderEcharts(
    () => {
      runGetHistoryFromCoinCap(code, interval.code);
    },
    chartInstance,
    [darkMode, code, interval.type]
  );

  return (
    <ChartCard onFresh={() => runGetHistoryFromCoinCap(code, interval.code)}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={intervalTypeList} activeType={interval.type} onSelected={setInterval} colspan={6} />
      </div>
    </ChartCard>
  );
};

export default Trend;
