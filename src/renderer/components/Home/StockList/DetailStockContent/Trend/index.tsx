import React, { useCallback } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface PerformanceProps {
  secid: string;
  zs: number;
}
const Trend: React.FC<PerformanceProps> = ({ secid, zs = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { darkMode } = useHomeContext();
  const { run: runGetTrendFromEastmoney } = useRequest(() => Services.Stock.GetTrendFromEastmoney(secid), {
    pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
    onSuccess: ({ trends }) => {
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
          type: 'category',
          data: trends.map(({ datetime, last }) => datetime),
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
          min: (value: any) => Math.min(value.min, zs),
          max: (value: any) => Math.max(value.max, zs),
        },
        series: [
          {
            data: trends.map(({ datetime, last }) => [datetime, last]),
            type: 'line',
            name: '价格',
            showSymbol: false,
            symbol: 'none',
            smooth: true,
            lineStyle: {
              width: 1,
              color: Utils.GetValueColor(Number(trends[trends.length - 1]?.last) - zs).color,
            },
            markPoint: {
              symbol: 'pin',
              symbolSize: 30,
              data: [
                { type: 'max', label: { fontSize: 10 } },
                { type: 'min', label: { fontSize: 10 } },
              ],
            },
            markLine: {
              symbol: 'none',
              label: {
                position: 'insideEndBottom',
                fontSize: 10,
              },
              data: [
                {
                  name: '昨收',
                  yAxis: zs,
                },
              ],
            },
          },
        ],
      });
    },
    refreshDeps: [darkMode, secid, zs],
    ready: !!chartInstance,
  });

  return (
    <ChartCard onFresh={runGetTrendFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default Trend;
