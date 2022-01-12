import React, { useCallback } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

export interface RealTimeFundFlowProps {
  code: string;
}

const RealTimeFundFlow: React.FC<RealTimeFundFlowProps> = ({ code = '' }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();
  const { run: runGetRealTimeFundFlowFromEasymoney } = useRequest(() => Services.Quotation.GetRealTimeFundFlowFromEasymoney(code), {
    pollingInterval: 1000 * 60,

    onSuccess: (result) => {
      const seriesStyle = {
        type: 'line',
        showSymbol: false,
        symbol: 'none',
        lineStyle: {
          width: 1,
        },
      };
      chartInstance?.setOption({
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          position: 'inside',
        },
        legend: {
          data: ['今日主力净流入', '今日超大单净流入', '今日大单净流入', '今日中单净流入', '今日小单净流入'],
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          containLabel: true,
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
    refreshDeps: [darkMode, code],
    ready: !!chartInstance,
  });

  return (
    <ChartCard onFresh={runGetRealTimeFundFlowFromEasymoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default RealTimeFundFlow;
