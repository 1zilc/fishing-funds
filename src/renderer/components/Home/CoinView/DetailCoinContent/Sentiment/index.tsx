import React from 'react';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.css';

export interface SentimentProps {
  up?: number;
  down?: number;
}

const Sentiment: React.FC<SentimentProps> = ({ up = 0, down = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  useRenderEcharts(
    ({ varibleColors }) => {
      chartInstance?.setOption({
        backgroundColor: 'transparent',
        title: {
          show: false,
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
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
              color: 'var(--main-text-color)',
            },
            labelLine: {
              lineStyle: {
                color: 'var(--main-text-color)',
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: 'var(--background-color)',
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
    [up, down]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Sentiment;
