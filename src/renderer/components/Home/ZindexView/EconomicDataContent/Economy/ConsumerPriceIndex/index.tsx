import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts, useNativeThemeColor } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

interface ConsumerPriceIndexProps {}

const ConsumerPriceIndex: React.FC<ConsumerPriceIndexProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);
  const { varibleColors } = useNativeThemeColor();

  const { run: runGetEconomyIndexFromEastmoney } = useRequest(() => Services.Zindex.GetEconomyIndexFromEastmoney(19), {
    onSuccess: (result) => {
      try {
        chartInstance?.setOption({
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
            position: 'inside',
          },
          legend: {
            data: ['全国', '城市', '农村'],
            textStyle: {
              color: varibleColors['--main-text-color'],
              fontSize: 10,
            },
          },
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 32,
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
            scale: true,
            axisLabel: {
              fontSize: 10,
            },
            splitLine: {
              lineStyle: {
                color: varibleColors['--border-color'],
              },
            },
          },
          series: [
            {
              type: 'line',
              name: '全国',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item[0], item[1]]),
            },
            {
              type: 'line',
              name: '城市',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item[0], item[5]]),
            },
            {
              type: 'line',
              name: '农村',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item[0], item[9]]),
            },
          ],
        });
      } catch {}
    },
    refreshDeps: [varibleColors],
    ready: !!chartInstance,
  });

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>居民消费价格指数(CPI)</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default ConsumerPriceIndex;
