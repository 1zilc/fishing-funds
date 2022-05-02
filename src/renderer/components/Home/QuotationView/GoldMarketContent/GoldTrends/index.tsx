import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@/services';
import * as CONST from '@/constants';
import styles from './index.module.scss';

interface GoldTrendsProps {
  secid: string;
  title: string;
}

const GoldTrends: React.FC<GoldTrendsProps> = (props) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runGetAumFromEastmoney } = useRequest(() => Services.Quotation.GetGoldTrendsFromEastmoney(props.secid), {
    ready: !!chartInstance,
  });

  useRenderEcharts(
    ({ varibleColors }) => {
      chartInstance?.setOption({
        title: {
          show: false,
          text: '沪深主力',
        },
        tooltip: {
          trigger: 'axis',
          position: 'inside',
        },
        legend: {
          show: false,
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: 'time',
            boundaryGap: false,
          },
        ],
        yAxis: {
          scale: true,
          type: 'value',
          splitLine: {
            lineStyle: {
              color: varibleColors['--border-color'],
            },
          },
        },
        series: [
          {
            name: '价格',
            type: 'line',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              width: 1,
            },
            data: result,
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard className={styles.content} onFresh={runGetAumFromEastmoney} TitleBar={<div className={styles.titleBar}>{props.title}</div>}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default GoldTrends;
