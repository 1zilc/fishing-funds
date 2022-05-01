import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';

import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts, useNativeThemeColor } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface KProps {
  code: string;
}

const yearTypeList = [
  { name: '一年', type: 1, code: 1 },
  { name: '三年', type: 2, code: 3 },
  { name: '五年', type: 3, code: 5 },
  { name: '十年', type: 4, code: 10 },
  { name: '最大', type: 5, code: 50 },
];

const K: React.FC<KProps> = ({ code = '' }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [year, setYearType] = useState(yearTypeList[0]);
  const { varibleColors } = useNativeThemeColor();
  const { run: runGetKFromEastmoney } = useRequest(() => Services.Zindex.GetKFromEastmoney(code, year.code), {
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
          splitLine: {
            lineStyle: {
              color: varibleColors['--border-color'],
            },
          },
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
            data: Utils.CalculateMA(5, values),
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
            data: Utils.CalculateMA(10, values),
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
            data: Utils.CalculateMA(20, values),
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
            data: Utils.CalculateMA(30, values),
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
    refreshDeps: [code, year.code],
    ready: !!chartInstance,
  });

  return (
    <ChartCard onFresh={runGetKFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={yearTypeList} activeType={year.type} onSelected={setYearType} flex />
      </div>
    </ChartCard>
  );
};

export default K;
