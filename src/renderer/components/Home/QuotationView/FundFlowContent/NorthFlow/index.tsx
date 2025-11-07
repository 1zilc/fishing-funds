import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@lib/enh/services';

import styles from './index.module.css';

export interface NorthFlowProps {}

const fields1 = 'f1,f3';
const code = 's2n';

const NorthFlow: React.FC<NorthFlowProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runGetFlowFromEastmoney } = useRequest(
    () => Services.Quotation.GetFlowFromEastmoney(fields1, code),
    {
      pollingInterval: 1000 * 60,
      refreshDeps: [code],
      ready: !!chartInstance,
    }
  );
  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          position: 'inside',
        },
        legend: {
          top: 0,
          data: ['沪股通', '深股通', '北向'],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 24,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: {
          type: 'category',
          data: result.map(({ time }) => time),
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}亿`,
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
          },
        },
        series: [
          {
            type: 'line',
            name: '沪股通',
            showSymbol: false,
            symbol: 'none',
            data: result.map(({ time, h }) => [time, h]),
            lineStyle: {
              width: 1,
            },
          },
          {
            type: 'line',
            name: '深股通',
            showSymbol: false,
            symbol: 'none',
            data: result.map(({ time, s }) => [time, s]),
            lineStyle: {
              width: 1,
            },
          },
          {
            type: 'line',
            name: '北向',
            showSymbol: false,
            symbol: 'none',
            data: result.map(({ time, value }) => [time, value]),
            lineStyle: {
              width: 1,
            },
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard onFresh={runGetFlowFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default NorthFlow;
