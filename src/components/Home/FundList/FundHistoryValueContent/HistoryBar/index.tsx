import React, { useEffect, useRef, useState, useContext } from 'react';
import dayjs from 'dayjs';
import { useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import styles from './index.scss';

interface HistoryBarProps {
  data?: { x: number; y: number; equityReturn: number; unitMoney: 0 }[];
}

const HistoryBar: React.FC<HistoryBarProps> = ({ data = [] }) => {
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
        bottom: 10,
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
      },
      series: [
        {
          type: 'bar',
          data:
            data.map(({ equityReturn }) => {
              return {
                value: equityReturn,
                itemStyle: {
                  color:
                    equityReturn >= 0
                      ? varibleColors['--increase-color']
                      : varibleColors['--reduce-color'],
                },
              };
            }) || [],
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
  };

  useEffect(() => {
    initChart();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      renderChart();
    }
  }, [darkMode, chartInstance, data]);

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

export default HistoryBar;
