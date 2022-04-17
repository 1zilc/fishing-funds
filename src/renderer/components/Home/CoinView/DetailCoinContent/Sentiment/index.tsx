import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts, useDrawer } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export interface SentimentProps {
  up?: number;
  down?: number;
}

const Sentiment: React.FC<SentimentProps> = ({ up = 0, down = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        backgroundColor: 'transparent',
        title: {
          show: false,
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '趋势',
            type: 'pie',
            radius: '64%',
            center: ['50%', '50%'],
            data: [
              {
                value: up,
                name: '积极占比',
                itemStyle: {
                  color: varibleColors['--increase-color'],
                },
              },
              {
                value: down,
                name: '消极占比',
                itemStyle: {
                  color: varibleColors['--reduce-color'],
                },
              },
            ],
            label: {
              color: varibleColors['--main-text-color'],
            },
            labelLine: {
              lineStyle: {
                color: varibleColors['--main-text-color'],
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: varibleColors['--background-color'],
              borderWidth: 1,
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: () => Math.random() * 200,
          },
        ],
      });
    },
    chartInstance,
    [darkMode, up, down]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Sentiment;
