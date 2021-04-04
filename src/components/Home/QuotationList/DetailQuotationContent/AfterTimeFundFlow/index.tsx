import React, { useEffect, useRef, useState, useContext } from 'react';
import classnames from 'classnames';
import { useRequest, useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface AfterTimeFundFlowProps {
  code: string;
}

const AfterTimeFundFlow: React.FC<AfterTimeFundFlowProps> = ({ code }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );

  const { width: chartRefWidth } = useSize(chartRef);
  const { varibleColors, darkMode } = useContext(HomeContext);
  const { run: runGetAfterTimeFundFlowFromEasymoney } = useRequest(
    Services.Quotation.GetAfterTimeFundFlowFromEasymoney,
    {
      manual: true,
      throwOnError: true,
      cacheKey: `GetAfterTimeFundFlowFromEasymoney/${code}`,
      pollingInterval: 1000 * 60,
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
              '主力净流入',
              '超大单净流入',
              '大单净流入',
              '中单净流入',
              '小单净流入',
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
          dataZoom: [
            {
              type: 'inside',
              minValueSpan: 3600 * 24 * 1000 * 7,
              start: 90,
              end: 100,
            },
          ],
          series: [
            {
              name: '主力净流入',
              data: result.map(({ datetime, zljlr }: any) => [datetime, zljlr]),
              ...seriesStyle,
            },
            {
              name: '超大单净流入',
              data: result.map(({ datetime, cddjlr }: any) => [
                datetime,
                cddjlr,
              ]),
              ...seriesStyle,
            },
            {
              name: '大单净流入',
              data: result.map(({ datetime, ddjlr }: any) => [datetime, ddjlr]),
              ...seriesStyle,
            },
            {
              name: '中单净流入',
              data: result.map(({ datetime, zdjlr }: any) => [datetime, zdjlr]),
              ...seriesStyle,
            },
            {
              name: '小单净流入',
              data: result.map(({ datetime, xdjlr }: any) => [datetime, xdjlr]),
              ...seriesStyle,
            },
          ],
        });
      },
    }
  );

  const initChart = () => {
    const chartInstance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    setChartInstance(chartInstance);
  };

  useEffect(initChart, []);

  useEffect(() => {
    if (chartInstance) {
      runGetAfterTimeFundFlowFromEasymoney(code);
    }
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

export default AfterTimeFundFlow;
