import React from 'react';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.css';

export interface ProfitProps {
  profit: Fund.Manager.Profit;
}

const Profit: React.FC<ProfitProps> = ({ profit }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        xAxis: {
          type: 'category',
          data: profit?.categories || [],
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}%`,
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
          },
        },
        grid: {
          top: '3%',
          left: 0,
          right: 0,
          bottom: 0,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        series: [
          {
            data: profit?.series?.[0]?.data.map(({ y }) => y) || [],
            type: 'bar',
            itemStyle: {
              normal: {
                color: (params: any) => {
                  const item = profit?.series?.[0]?.data?.[params.dataIndex] || {};
                  return item.color || params.color;
                },
              },
            },
          },
        ],
      });
    },
    chartInstance,
    [profit]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Profit;
