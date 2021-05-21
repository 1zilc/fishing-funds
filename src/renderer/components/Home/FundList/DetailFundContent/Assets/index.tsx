import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.scss';

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
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );
  const { varibleColors, darkMode } = useHomeContext();

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
          data: Data_assetAllocation?.series?.map((item) => item.name) || [],
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
          },
          {
            position: 'right',
            type: 'value',
            axisLabel: {
              formatter: '{value}亿',
            },
          },
        ],
        series:
          Data_assetAllocation?.series?.map((item) => ({
            name: item.name,
            type: item.type || 'bar',
            barGap: 2,
            yAxisIndex: item.type ? 1 : 0,
            data: item.data,
          })) || [],
      });
    },
    chartInstance,
    [darkMode, Data_assetAllocation]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default Assets;
