import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@/services';
import styles from './index.module.css';

interface RevenueProps {}

const Revenue: React.FC<RevenueProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);

  const { data: result = [], run: runGetEconomyIndexFromEastmoney } = useRequest(
    () => Services.Zindex.GetEconomyIndexFromEastmoney('RPT_ECONOMY_INCOME', 'REPORT_DATE,BASE'),
    {
      ready: !!chartInstance,
    }
  );

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
            top: 0,
            data: ['当月'],
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
            scale: true,
            axisLabel: {
              fontSize: 10,
              formatter: `{value}亿`,
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
              name: '当月',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.BASE]),
            },
          ],
        });
      } catch {}
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>财政收入</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default Revenue;
