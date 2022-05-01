import React from 'react';
import dayjs from 'dayjs';

import { useResizeEchart, useRenderEcharts, useNativeThemeColor } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface HistoryBarProps {
  data?: { x: number; y: number; equityReturn: number; unitMoney: 0 }[];
}

const HistoryBar: React.FC<HistoryBarProps> = ({ data = [] }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors } = useNativeThemeColor();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        title: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: '3%',
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 10,
          },
          data: data.map(({ x }) => dayjs(x).format('YYYY-MM-DD')) || [],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}%`,
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: varibleColors['--border-color'],
            },
          },
        },
        series: [
          {
            type: 'bar',
            data: data.map(({ equityReturn }) => {
              return {
                value: equityReturn,
                itemStyle: {
                  color: Utils.GetValueColor(equityReturn).color,
                },
              };
            }),
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 95,
            end: 100,
            minValueSpan: 7,
          },
        ],
      });
    },
    chartInstance,
    [data]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default HistoryBar;
