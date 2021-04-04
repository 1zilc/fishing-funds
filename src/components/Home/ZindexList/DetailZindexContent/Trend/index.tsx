import React, { useEffect, useRef, useState, useContext } from 'react';
import classnames from 'classnames';
import { useRequest, useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface PerformanceProps {
  code: string;
}
const trendTypeList = [
  { name: '一天', type: 1, code: 1 },
  { name: '两天', type: 2, code: 2 },
  { name: '三天', type: 3, code: 3 },
  { name: '四天', type: 4, code: 4 },
  { name: '五天', type: 5, code: 5 },
];
const Trend: React.FC<PerformanceProps> = ({ code }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );
  const [trend, setTrendType] = useState(trendTypeList[0]);
  const { width: chartRefWidth } = useSize(chartRef);
  const { varibleColors, darkMode } = useContext(HomeContext);
  const { run: runGetTrendFromEastmoney } = useRequest(
    Services.Zindex.GetTrendFromEastmoney,
    {
      manual: true,
      throwOnError: true,
      cacheKey: `GetTrendFromEastmoney/${code}/${trend.code}`,
      onSuccess: (result) => {
        chartInstance?.setOption({
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
            position: 'inside',
          },
          grid: {
            left: 0,
            right: 5,
            bottom: 0,
            top: 15,
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: result?.map(({ time, price }) => time) || [],
            boundaryGap: false,
            axisLabel: {
              fontSize: 10,
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: `{value}`,
              fontSize: 10,
            },
            scale: true,
          },
          dataZoom: [
            {
              type: 'inside',
              minValueSpan: 3600 * 24 * 1000 * 1,
            },
          ],
          series: [
            {
              data: result?.map(({ time, price }) => [time, price]) || [],
              type: 'line',
              name: '价格',
              showSymbol: false,
              symbol: 'none',
              lineStyle: {
                width: 1,
              },
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
      runGetTrendFromEastmoney(code, trend.code);
    }
  }, [darkMode, chartInstance, trend.code]);

  useEffect(() => {
    chartInstance?.resize({
      height: (chartRefWidth! * 250) / 400,
    });
  }, [chartRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
      <div className={styles.selections}>
        {trendTypeList.map((item) => (
          <div
            key={item.type}
            className={classnames(styles.selection, {
              [styles.active]: trend.type === item.type,
            })}
            onClick={() => setTrendType(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trend;
