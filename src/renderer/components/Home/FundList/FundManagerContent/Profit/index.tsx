import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.scss';

export interface ProfitProps {
  profit: Fund.Manager.Profit;
}

const Profit: React.FC<ProfitProps> = ({ profit }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );
  const { darkMode } = useHomeContext();

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
        },
        grid: {
          top: '3%',
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
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
                  const item =
                    profit?.series?.[0]?.data?.[params.dataIndex] || {};
                  return item.color || params.color;
                },
              },
            },
          },
        ],
      });
    },
    chartInstance,
    [darkMode, profit]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default Profit;
