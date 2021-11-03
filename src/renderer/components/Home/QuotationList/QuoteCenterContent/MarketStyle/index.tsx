import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.scss';

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
  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        color: [varibleColors['--primary-color'], varibleColors['--warn-color']],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
        },
        grid: { top: 32, left: 0, right: 0, bottom: 0, containLabel: true },
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
          },
          {
            type: 'value',
            name: '热度',
            position: 'right',
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
    [darkMode, varibleColors, ThemeList]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default MarketStyle;
