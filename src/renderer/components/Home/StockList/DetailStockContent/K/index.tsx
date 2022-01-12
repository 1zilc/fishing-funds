import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import NP from 'number-precision';

import ChartCard from '@/components/Card/ChartCard';
import { useHomeContext } from '@/components/Home';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

export interface PerformanceProps {
  secid: string;
}

const kTypeList = [
  { name: '日K', type: 101, code: 101 },
  { name: '周K', type: 102, code: 102 },
  { name: '月K', type: 103, code: 103 },
  { name: '5分钟', type: 5, code: 5 },
  { name: '15分钟', type: 15, code: 15 },
  { name: '30分钟', type: 30, code: 30 },
  { name: '60分钟', type: 60, code: 60 },
];

function calculateMA(dayCount: any, values: any[]) {
  const result = [];
  for (let i = 0, len = values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += values[i - j][1];
    }
    result.push(NP.divide(sum, dayCount).toFixed(2));
  }
  return result;
}

const K: React.FC<PerformanceProps> = ({ secid = '' }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [k, setKType] = useState(kTypeList[0]);
  const { varibleColors, darkMode } = useHomeContext();
  const { run: runGetKFromEastmoney } = useRequest(() => Services.Stock.GetKFromEastmoney(secid, k.code), {
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
          type: 'category',
          data: result.map(({ date }) => date),
        },
        yAxis: {
          scale: true,
        },
        dataZoom: [
          {
            type: 'inside',
            start: 80,
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
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10, values),
            smooth: true,
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20, values),
            smooth: true,
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, values),
            smooth: true,
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5,
            },
          },
        ],
      });
    },
    refreshDeps: [darkMode, secid, k.code],
    ready: !!chartInstance,
  });

  return (
    <ChartCard onFresh={runGetKFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={kTypeList} activeType={k.type} onSelected={setKType} colspan={6} />
      </div>
    </ChartCard>
  );
};

export default K;
