import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@lib/enh/services';
import styles from './index.module.css';

export interface RealTimeFundFlowProps {
  secid: string;
}

const RealTimeFundFlow: React.FC<RealTimeFundFlowProps> = ({ secid = '' }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { data: result = [], run: runGetRealTimeFundFlowFromEasymoney } = useRequest(
    () => Services.Quotation.GetRealTimeFundFlowFromEasymoney(secid),
    {
      pollingInterval: 1000 * 60,
      refreshDeps: [secid],
      ready: !!chartInstance,
    }
  );

  useRenderEcharts(
    () => {
      const seriesStyle = {
        type: 'line',
        showSymbol: false,
        symbol: 'none',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          opacity: 0.8,
        },
        smooth: true,
        stack: '流入',
      };
      chartInstance?.setOption({
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          top: 0,
          data: ['今日主力净流入', '今日超大单净流入', '今日大单净流入', '今日中单净流入', '今日小单净流入'],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: {
          type: 'time',
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
            name: '今日主力净流入',
            data: result.map(({ datetime, zljlr }: any) => [datetime, zljlr]),
            ...seriesStyle,
          },
          {
            name: '今日超大单净流入',
            data: result.map(({ datetime, cddjlr }: any) => [datetime, cddjlr]),
            ...seriesStyle,
          },
          {
            name: '今日大单净流入',
            data: result.map(({ datetime, ddjlr }: any) => [datetime, ddjlr]),
            ...seriesStyle,
          },
          {
            name: '今日中单净流入',
            data: result.map(({ datetime, zdjlr }: any) => [datetime, zdjlr]),
            ...seriesStyle,
          },
          {
            name: '今日小单净流入',
            data: result.map(({ datetime, xdjlr }: any) => [datetime, xdjlr]),
            ...seriesStyle,
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard onFresh={runGetRealTimeFundFlowFromEasymoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default RealTimeFundFlow;
