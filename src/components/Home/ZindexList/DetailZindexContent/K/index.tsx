import React, { useEffect, useRef, useState, useContext } from 'react';
import classnames from 'classnames';
import { useRequest, useSize } from 'ahooks';
import * as echarts from 'echarts';
import NP from 'number-precision';

import { HomeContext } from '@/components/Home';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface PerformanceProps {
  code: string;
}
const yearTypeList = [
  { name: '一年', type: 1, code: 1 },
  { name: '三年', type: 2, code: 3 },
  { name: '五年', type: 3, code: 5 },
  { name: '十年', type: 4, code: 10 },
  { name: '最大', type: 5, code: 50 },
];

function calculateMA(dayCount: any, values: any[]) {
  var result = [];
  for (var i = 0, len = values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += values[i - j][1];
    }
    result.push(NP.divide(sum, dayCount).toFixed(2));
  }
  return result;
}

const K: React.FC<PerformanceProps> = ({ code }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [year, setYearType] = useState(yearTypeList[0]);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );

  const { width: chartRefWidth } = useSize(chartRef);
  const { varibleColors, darkMode } = useContext(HomeContext);
  const { run: runGetKFromEastmoney } = useRequest(
    Services.Zindex.GetKFromEastmoney,
    {
      manual: true,
      throwOnError: true,
      cacheKey: `GetKFromEastmoney/${code}`,
      onSuccess: (result) => {
        // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
        const values = result.map((_) => [_.kp, _.sp, _.zd, _.zg]);
        chartInstance?.setOption({
          title: {
            text: '',
            left: 0,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          legend: {
            data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
          },
          grid: {
            left: 0,
            right: 5,
            bottom: 0,
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: result.map(({ date }) => date),
          },
          yAxis: {
            scale: true,
          },
          dataZoom: [
            {
              type: 'inside',
              start: 95,
              end: 100,
            },
          ],
          series: [
            {
              name: '日K',
              type: 'candlestick',
              data: values,
              itemStyle: {
                color: varibleColors['--increase-color'],
                color0: varibleColors['--reduce-color'],
              },
              markPoint: {
                data: [
                  {
                    name: '最高值',
                    type: 'max',
                    valueDim: 'highest',
                  },
                  {
                    name: '最低值',
                    type: 'min',
                    valueDim: 'lowest',
                  },
                  {
                    name: '平均值',
                    type: 'average',
                    valueDim: 'close',
                  },
                ],
              },
            },
            {
              name: 'MA5',
              type: 'line',
              data: calculateMA(5, values),
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
            {
              name: 'MA10',
              type: 'line',
              data: calculateMA(10, values),
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
            {
              name: 'MA20',
              type: 'line',
              data: calculateMA(20, values),
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
            {
              name: 'MA30',
              type: 'line',
              data: calculateMA(30, values),
              smooth: true,
              lineStyle: {
                opacity: 0.5,
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
      runGetKFromEastmoney(code, year.code);
    }
  }, [darkMode, chartInstance, year.code]);

  useEffect(() => {
    chartInstance?.resize({
      height: (chartRefWidth! * 300) / 400,
    });
  }, [chartRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
      <div className={styles.selections}>
        {yearTypeList.map((item) => (
          <div
            key={item.type}
            className={classnames(styles.selection, {
              [styles.active]: year.type === item.type,
            })}
            onClick={() => setYearType(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default K;
