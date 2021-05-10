import React, { useEffect, useRef, useState, useContext } from 'react';
import { renderToString } from 'react-dom/server';
import { useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import styles from './index.scss';

interface ScaleProps {
  Data_fluctuationScale: {
    categories: string[];
    series: { y: number; mom: string }[];
  };
}
interface TooltipProps {
  time: string;
  value: number;
  rate: number;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>{props.time}</div>
      <div>净资产规模：{props.value}亿</div>
      <div>较上期环比：{props.rate}%</div>
    </div>
  );
};

const Scale: React.FC<ScaleProps> = ({ Data_fluctuationScale = {} }) => {
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
        text: '净资产',
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
        formatter: (params: any) => {
          const [{ data, name }] = params;
          return renderToString(
            <Tooltip time={name} value={data?.value} rate={data?.item?.mom} />
          );
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
        type: 'category',
        axisLabel: {
          fontSize: 10,
        },
        data: Data_fluctuationScale.categories || [],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10,
          formatter: `{value}亿`,
        },
      },
      series: [
        {
          data:
            Data_fluctuationScale.series?.map((item) => ({
              value: item.y,
              item,
            })) || [],

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
  };

  useEffect(() => {
    initChart();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      renderChart();
    }
  }, [darkMode, chartInstance, Data_fluctuationScale]);

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

export default Scale;
