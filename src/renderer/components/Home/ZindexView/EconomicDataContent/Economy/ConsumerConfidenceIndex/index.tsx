import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@lib/enh/services';
import styles from './index.module.css';

interface ConsumerConfidenceIndexProps {}

const ConsumerConfidenceIndex: React.FC<ConsumerConfidenceIndexProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);

  const { data: result = [], run: runGetEconomyIndexFromEastmoney } = useRequest(
    () =>
      Services.Zindex.GetEconomyIndexFromEastmoney(
        'RPT_ECONOMY_FAITH_INDEX',
        'REPORT_DATE,CONSUMERS_FAITH_INDEX,CONSUMERS_ASTIS_INDEX,CONSUMERS_EXPECT_INDEX'
      ),
    {
      ready: !!chartInstance,
    }
  );

  useRenderEcharts(
    () => {
      try {
        chartInstance?.setOption({
          title: {
            show: false,
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            top: 0,
            data: ['信心指数', '满意指数', '预期指数'],
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
              formatter: `{value}%`,
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
              name: '信心指数',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.CONSUMERS_FAITH_INDEX]),
            },
            {
              type: 'line',
              name: '满意指数',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.CONSUMERS_ASTIS_INDEX]),
            },
            {
              type: 'line',
              name: '预期指数',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.CONSUMERS_EXPECT_INDEX]),
            },
          ],
        });
      } catch {}
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>消费者信心指数</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default ConsumerConfidenceIndex;
