import React, { useEffect, useRef, useState, useContext } from 'react';
import { useRequest, useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import * as Services from '@/services';
import styles from './index.scss';

export interface PerformanceProps {
  code: string;
}

const RealTimeFundFlow: React.FC<PerformanceProps> = ({ code }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );

  const { width: chartRefWidth } = useSize(chartRef);
  const { varibleColors, darkMode } = useContext(HomeContext);
  const { run: runGetFundFlowFromEasymoney } = useRequest(
    Services.Quotation.GetFundFlowFromEasymoney,
    {
      manual: true,
      pollingInterval: 1000 * 60,
      throwOnError: true,
      onSuccess: (result) => {
        const seriesStyle = {
          type: 'line',
          showSymbol: false,
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
        };
        chartInstance?.setOption({
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
            position: 'inside',
          },
          legend: {
            data: [
              '今日主力净流入',
              '今日超大单净流入',
              '今日大单净流入',
              '今日中单净流入',
              '今日小单净流入',
            ],
            textStyle: {
              color: varibleColors['--main-text-color'],
              fontSize: 10,
            },
          },
          grid: {
            left: 0,
            right: 5,
            bottom: 0,
            containLabel: true,
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLabel: {
              fontSize: 10,
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: `{value}亿`,
              fontSize: 10,
            },
          },
          series: [
            {
              name: '今日主力净流入',
              data: result.map(({ datetime, zljlr }: any) => [datetime, zljlr]),
              ...seriesStyle,
            },
            {
              name: '今日超大单净流入',
              data: result.map(({ datetime, cddjlr }: any) => [
                datetime,
                cddjlr,
              ]),
              ...seriesStyle,
            },
            {
              name: '今日大单净流入',
              data: result.map(({ datetime, ddjlr }: any) => [datetime, ddjlr]),
              ...seriesStyle,
            },
            {
              name: '今日中单净流入',
              data: result.map(({ datetime, zdjlr }: any) => [datetime, zdjlr]),
              ...seriesStyle,
            },
            {
              name: '今日小单净流入',
              data: result.map(({ datetime, xdjlr }: any) => [datetime, xdjlr]),
              ...seriesStyle,
            },
          ],
        });
      },
    }
  );
  const initPerformanceChart = () => {
    const chartInstance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    setChartInstance(chartInstance);
  };

  useEffect(initPerformanceChart, []);

  useEffect(() => {
    runGetFundFlowFromEasymoney(code);
  }, [darkMode, chartInstance]);

  useEffect(() => {
    chartInstance?.resize({
      height: (chartRefWidth! * 250) / 400,
    });
  }, [chartRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default RealTimeFundFlow;
