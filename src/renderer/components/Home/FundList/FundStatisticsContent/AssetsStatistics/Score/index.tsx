import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';

export interface ScoreProps {
  gssyl: number;
}

const Score: React.FC<ScoreProps> = ({ gssyl = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.48);
  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: -5,
            max: 5,
            splitNumber: 8,
            radius: '150%',
            center: ['50%', '95%'],
            axisLine: {
              lineStyle: {
                width: 2,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2'],
                ],
              },
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 6,
              offsetCenter: [0, '-55%'],
              itemStyle: {
                color: 'auto',
              },
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2,
              },
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 1,
              },
            },
            axisLabel: {
              color: varibleColors['--main-text-color'],
              fontSize: 10,
              distance: -50,
              formatter: (value: number) => {
                if (value === 3.75) {
                  return '优';
                } else if (value === 1.25) {
                  return '中';
                } else if (value === -1.25) {
                  return '良';
                } else if (value === -3.75) {
                  return '差';
                } else {
                  return '';
                }
              },
            },
            title: {
              offsetCenter: [0, '-25%'],
              fontSize: 10,
              color: varibleColors['--inner-text-color'],
            },
            detail: {
              fontSize: 12,
              offsetCenter: [0, '-5%'],
              valueAnimation: true,
              formatter: (value: number) => {
                return `${Math.round((value + 5) * 10)} 分`;
              },
              color: 'auto',
            },
            data: [
              {
                value: gssyl,
                name: '今日成绩',
              },
            ],
          },
        ],
      });
    },
    chartInstance,
    [darkMode, gssyl]
  );

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Score;
