import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
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
          barGap: '2px',
          yAxisIndex: item.type ? 1 : 0,
          data: item.data,
        })) || [],
    });
  };

  useEffect(() => {
    initChart();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      renderChart();
    }
  }, [darkMode, chartInstance, Data_assetAllocation]);

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

export default Assets;
