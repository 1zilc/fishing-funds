import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';

import styles from './index.scss';

export interface SouthFlowProps {}

const fields1 = 'f2,f4';
const code = 'n2s';

const SouthFlow: React.FC<SouthFlowProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { varibleColors, darkMode } = useHomeContext();
  const { run: runGetFlowFromEastmoney } = useRequest(Services.Quotation.GetFlowFromEastmoney, {
    manual: true,
    throwOnError: true,
    pollingInterval: 1000 * 60,
    cacheKey: `GetFlowFromEastmoney/${fields1}/${code}`,
    onSuccess: (result) => {
      chartInstance?.setOption({
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          position: 'inside',
        },
        legend: {
          data: ['港股通(沪)', '港股通(深)', '南向'],
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 24,
          containLabel: true,
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
        },
        series: [
          {
            type: 'line',
            name: '港股通(沪)',
            showSymbol: false,
            symbol: 'none',
            data: result.map(({ time, h }) => [time, h]),
            lineStyle: {
              width: 1,
            },
          },
          {
            type: 'line',
            name: '港股通(深)',
            showSymbol: false,
            symbol: 'none',
            data: result.map(({ time, s }) => [time, s]),
            lineStyle: {
              width: 1,
            },
          },
          {
            type: 'line',
            name: '南向',
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
  });

  useRenderEcharts(
    () => {
      runGetFlowFromEastmoney(fields1, code);
    },
    chartInstance,
    [darkMode]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default SouthFlow;
