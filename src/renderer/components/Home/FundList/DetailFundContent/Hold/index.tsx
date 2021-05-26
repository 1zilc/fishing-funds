import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.scss';

interface HoldProps {
  Data_holderStructure: {
    categories: string[];
    series: { name: string; data: string[] }[];
  };
}

const Hold: React.FC<HoldProps> = ({
  Data_holderStructure = {
    categories: [],
    series: [],
  },
}) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );

  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        title: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: Data_holderStructure.series.map((item) => item.name),
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: Data_holderStructure.categories || [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            max: 100,
            axisLabel: {
              formatter: `{value}%`,
              fontSize: 10,
            },
          },
        ],
        series: Data_holderStructure.series.map((item) => ({
          name: item.name,
          type: 'line',
          stack: '总量',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
          },
          data: item.data || [],
        })),
      });
    },
    chartInstance,
    [darkMode, Data_holderStructure]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default Hold;
