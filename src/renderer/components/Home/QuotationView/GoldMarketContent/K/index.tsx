import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

export interface KProps {}

const K: React.FC<KProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runGetKFromEastmoney } = useRequest(() => Services.Quotation.GetGoldKFromEastmoney(), {
    ready: !!chartInstance,
  });
  useRenderEcharts(
    ({ varibleColors }) => {
      // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
      const values = result.map(([time, ...values]) => values);
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
          top: 0,
          data: ['日K', 'MA5', 'MA10'],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: {
          type: 'category',
          data: result.map(([time]) => time),
        },
        yAxis: [
          {
            scale: true,
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
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
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard onFresh={runGetKFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default K;
