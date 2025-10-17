import React from 'react';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.css';

interface AssetsProps {
  Data_assetAllocation: {
    categories: string[];
    series: {
      name: string;
      type: string;
      data: number[];
      yAxis: number;
    }[];
  };
}

const Assets: React.FC<AssetsProps> = ({ Data_assetAllocation = {} }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          top: 0,
          data: Data_assetAllocation?.series?.map((item) => item.name) || [],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: [
          {
            type: 'category',
            data: Data_assetAllocation?.categories || [],
          },
        ],
        yAxis: [
          {
            position: 'left',
            type: 'value',
            max: 100,
            axisLabel: {
              formatter: '{value}%',
            },
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
          {
            position: 'right',
            type: 'value',
            axisLabel: {
              formatter: '{value}亿',
            },
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
        ],
        series:
          Data_assetAllocation?.series?.map((item) => ({
            name: item.name,
            type: item.type || 'bar',
            barGap: 0,
            yAxisIndex: item.type ? 1 : 0,
            data: item.data,
          })) || [],
      });
    },
    chartInstance,
    [Data_assetAllocation]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Assets;
