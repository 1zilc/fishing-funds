import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.css';

interface TreasuryYieldProps {}

const TreasuryYield: React.FC<TreasuryYieldProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runZindexGetTreasuryYieldData } = useRequest(Services.Zindex.GetTreasuryYieldData, {
    ready: !!chartInstance,
  });

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
          data: ['中国国债收益率:10年', '美国国债收益率:10年'],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}%`,
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
            name: '中国国债收益率:10年',
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              width: 1,
            },
            data: result.map(({ EMM00166466, SOLAR_DATE }) => [SOLAR_DATE, EMM00166466]),
          },
          {
            type: 'line',
            showSymbol: false,
            name: '美国国债收益率:10年',
            symbol: 'none',
            lineStyle: {
              width: 1,
            },
            data: result.map(({ EMG00001310, SOLAR_DATE }) => [SOLAR_DATE, EMG00001310]),
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard onFresh={runZindexGetTreasuryYieldData}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default TreasuryYield;
