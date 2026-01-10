import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@lib/enh/services';
import styles from './index.module.css';

interface DepositReserveRatioProps {}

const DepositReserveRatio: React.FC<DepositReserveRatioProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);

  const { data: result = [], run: runGetEconomyIndexFromEastmoney } = useRequest(
    () =>
      Services.Zindex.GetEconomyIndexFromEastmoney(
        'RPT_ECONOMY_DEPOSIT_RESERVE',
        'REPORT_DATE,PUBLISH_DATE,INTEREST_RATE_BA,INTEREST_RATE_SA'
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
            data: ['大型金融机构', '中小金融机构'],
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
              name: '大型金融机构',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.INTEREST_RATE_BA]),
            },
            {
              type: 'line',
              name: '中小金融机构',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.INTEREST_RATE_SA]),
            },
          ],
        });
      } catch {}
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>存款准备金率</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default DepositReserveRatio;
