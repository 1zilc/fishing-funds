import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import styles from './index.scss';

export interface ProfitProps {
  profit: Fund.Manager.Profit;
}

const Profit: React.FC<ProfitProps> = ({ profit }) => {
  const profitRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );
  const { width: chartRefWidth } = useSize(profitRef);
  const { darkMode } = useContext(HomeContext);

  const initChart = () => {
    const instance = echarts.init(profitRef.current!, undefined, {
      renderer: 'svg',
    });
    setChartInstance(instance);
  };
  const renderChart = () => {
    chartInstance?.setOption({
      xAxis: {
        type: 'category',
        data: profit?.categories || [],
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
      grid: {
        top: 20,
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
          data: profit?.series?.[0]?.data.map(({ y }) => y) || [],
          type: 'bar',
          itemStyle: {
            normal: {
              color: (params: any) => {
                const item =
                  profit?.series?.[0]?.data?.[params.dataIndex] || {};
                return item.color || params.color;
              },
            },
          },
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
  }, [darkMode, chartInstance, profit]);

  useEffect(() => {
    chartInstance?.resize({
      height: chartRefWidth,
    });
  }, [chartRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={profitRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default Profit;
