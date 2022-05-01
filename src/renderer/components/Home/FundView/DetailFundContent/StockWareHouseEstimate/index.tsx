import React from 'react';

import { useResizeEchart, useRenderEcharts, useNativeThemeColor } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export interface StockWareHouseEstimateProps {
  fundSharesPositions: [number, number][];
}

const StockWareHouseEstimate: React.FC<StockWareHouseEstimateProps> = ({ fundSharesPositions }) => {
  const { varibleColors } = useNativeThemeColor();
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        title: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          confine: true,
        },
        grid: {
          top: '3%',
          left: 0,
          right: 5,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
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
          scale: true,
          splitLine: {
            lineStyle: {
              color: varibleColors['--border-color'],
            },
          },
        },
        series: [
          {
            data: fundSharesPositions,
            type: 'line',
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
          },
        ],
      });
    },
    chartInstance,
    [fundSharesPositions]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default StockWareHouseEstimate;
