import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@/services';
import styles from './index.module.scss';

interface ForeignExchangeAndGoldProps {}

const ForeignExchangeAndGold: React.FC<ForeignExchangeAndGoldProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);
  const { data: result = [], run: runGetEconomyIndexFromEastmoney } = useRequest(() => Services.Zindex.GetEconomyIndexFromEastmoney(16), {
    ready: !!chartInstance,
  });

  useRenderEcharts(
    () => {
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
            data: ['外汇储备', '黄金储备'],
            textStyle: {
              color: 'var(--main-text-color)',
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
          yAxis: [
            {
              type: 'value',
              scale: true,
              axisLabel: {
                fontSize: 10,
                formatter: `{value}亿美元`,
              },
              splitLine: {
                lineStyle: {
                  color: 'var(--border-color)',
                },
              },
            },
            {
              type: 'value',
              scale: true,
              axisLabel: {
                fontSize: 10,
                formatter: `{value}万盎司`,
              },
              splitLine: {
                lineStyle: {
                  color: 'var(--border-color)',
                },
              },
            },
          ],
          series: [
            {
              type: 'line',
              name: '外汇储备',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item[0], item[1]]),
            },
            {
              type: 'line',
              name: '黄金储备',
              yAxisIndex: 1,
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item[0], item[4]]),
            },
          ],
        });
      } catch {}
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>外汇和黄金储备</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default ForeignExchangeAndGold;
