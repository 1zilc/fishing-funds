import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import styles from './index.scss';

interface SimilarProportionProps {
  rateInSimilarPersent?: [][];
}

const SimilarProportion: React.FC<SimilarProportionProps> = ({
  rateInSimilarPersent = [],
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );
  const { width: chartRefWidth } = useSize(chartRef);
  const { varibleColors, darkMode } = useContext(HomeContext);

  const initChart = () => {
    const instance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    setChartInstance(instance);
  };

  const renderChart = () => {
    chartInstance?.setOption({
      title: {
        text: '优于同类百分比',
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
          formatter: `{value}%`,
          fontSize: 10,
        },
      },
      series: [
        {
          data: rateInSimilarPersent,
          type: 'line',
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
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
  };

  useEffect(() => {
    initChart();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      renderChart();
    }
  }, [darkMode, chartInstance, rateInSimilarPersent]);

  useEffect(() => {
    chartInstance?.resize({
      height: chartRefWidth! * 0.64,
    });
  }, [chartRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default SimilarProportion;
