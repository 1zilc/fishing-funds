import React from 'react';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.css';

interface MarketStyleProps {
  ThemeList: {
    Code: string;
    Name: string;
    IsImportant: string;
    TopCode: string;
    TopName: string;
    DayType: 1;
    Chg: string;
    HotRate: number;
  }[];
}

const MarketStyle: React.FC<MarketStyleProps> = (props) => {
  const { ThemeList = [] } = props;
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        color: ['var(--primary-color)', 'var(--warn-color)'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
        },
        grid: { top: 32, left: 0, right: 0, bottom: 0, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        legend: {
          show: false,
        },
        xAxis: [
          {
            type: 'category',
            data: ThemeList.map((t) => t.Name),
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '涨跌幅',
            position: 'left',
            axisLabel: { formatter: '{value}%' },
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
          {
            type: 'value',
            name: '热度',
            position: 'right',
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
        ],
        series: [
          {
            name: '涨跌幅',
            type: 'bar',
            data: ThemeList.map((t) => ({
              value: t.Chg,
              itemStyle: {
                color: Utils.GetValueColor(t.Chg).color,
              },
            })),
          },
          {
            name: '热度',
            type: 'line',
            yAxisIndex: 1,
            data: ThemeList.map((t) => t.HotRate),
          },
        ],
      });
    },
    chartInstance,
    [ThemeList]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default MarketStyle;
