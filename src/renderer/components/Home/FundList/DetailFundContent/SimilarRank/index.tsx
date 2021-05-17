import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.scss';

interface SimilarRankProps {
  rateInSimilarType?: { x: number; y: number; sc: string }[];
}

const SimilarRank: React.FC<SimilarRankProps> = ({
  rateInSimilarType = [],
}) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );
  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        title: {
          text: '同类中排名',
          left: 'center',
          top: 0,
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 32,
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
            fontSize: 10,
          },
        },
        series: [
          {
            data: rateInSimilarType?.map(({ x, y, sc }) => [x, y]),
            type: 'bar',
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 90,
            end: 100,
            minValueSpan: 3600 * 24 * 1000 * 7,
          },
        ],
      });
    },
    chartInstance,
    [darkMode, rateInSimilarType]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default SimilarRank;
