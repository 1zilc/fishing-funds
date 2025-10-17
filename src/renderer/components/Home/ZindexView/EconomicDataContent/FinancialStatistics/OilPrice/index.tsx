import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@/services';
import styles from './index.module.css';

interface OilPriceProps {}

const OilPrice: React.FC<OilPriceProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);
  const { data: result = [], run: runGetOilPriceFromEastmoney } = useRequest(Services.Zindex.GetOilPriceFromEastmoney, {
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
            top: 0,
            data: ['NYMEX原油', '汽油', '柴油'],
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
          yAxis: [
            {
              type: 'value',
              scale: true,
              axisLabel: {
                fontSize: 10,
                formatter: `{value}美元/桶`,
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
                formatter: `{value}元/吨`,
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
              name: 'NYMEX原油',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item) => [item.DATE, item.CLOSE]),
            },
            {
              type: 'line',
              name: '汽油',
              showSymbol: false,
              yAxisIndex: 1,
              lineStyle: { width: 1 },
              data: result.map((item) => [item.DATE, item.QY]),
            },
            {
              type: 'line',
              name: '柴油',
              showSymbol: false,
              yAxisIndex: 1,
              lineStyle: { width: 1 },
              data: result.map((item) => [item.DATE, item.CY]),
            },
          ],
        });
      } catch {}
    },
    chartInstance,
    [result]
  );
  return (
    <ChartCard auto onFresh={runGetOilPriceFromEastmoney} TitleBar={<div className={styles.title}>油价</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default OilPrice;
