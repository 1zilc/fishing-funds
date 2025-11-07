import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import ExportTitleBar from '@/components/ExportTitleBar';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useAppSelector, useRenderEcharts } from '@/utils/hooks';

import * as CONST from '@/constants';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

export interface PerformanceProps {
  code: string;
  name?: string;
}

const dateTypeList = [
  { name: '1天', type: 1, code: '1' },
  { name: '1月', type: 3, code: '30' },
  { name: '3月', type: 4, code: '90' },
  { name: '半年', type: 5, code: '180' },
  { name: '1年', type: 6, code: '365' },
  { name: '最大', type: 7, code: 'max' },
];

const K: React.FC<PerformanceProps> = ({ code = '', name }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [date, setDateType] = useState(dateTypeList[5]);
  const coinUnitSetting = useAppSelector((state) => state.setting.systemSetting.coinUnitSetting);

  const { data: result = [], run: runGetKFromCoingecko } = useRequest(
    () => Services.Coin.GetKFromCoingecko(code, coinUnitSetting, date.code),
    {
      refreshDeps: [code, coinUnitSetting, date.code],
      ready: !!chartInstance,
    }
  );

  useRenderEcharts(
    ({ varibleColors }) => {
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
          data: ['MA5', 'MA10', 'MA20', 'MA30', 'MA60', 'MA120', 'MA250'],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
          selected: {
            MA60: false,
            MA120: false,
            MA250: false,
          },
          top: 0,
          padding: [5, 0, 5, 0],
          itemGap: 5,
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 42,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: {
          type: 'category',
          data: result.map(({ time }) => time),
          axisLabel: { show: true, fontSize: 10 },
        },
        yAxis: {
          scale: true,
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
          },
          axisLabel: { show: true, fontSize: 10 },
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
            name: 'K线',
            type: 'candlestick',
            data: values,
            itemStyle: {
              color: varibleColors['--increase-color'],
              color0: varibleColors['--reduce-color'],
            },
            markPoint: {
              symbolSize: 30,
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
          {
            name: 'MA60',
            type: 'line',
            data: Utils.CalculateMA(60, values),
            smooth: true,
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: 'MA120',
            type: 'line',
            data: Utils.CalculateMA(120, values),
            smooth: true,
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: 'MA250',
            type: 'line',
            data: Utils.CalculateMA(250, values),
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
    <ChartCard onFresh={runGetKFromCoingecko} TitleBar={<ExportTitleBar name={name} data={result} />}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={dateTypeList} activeType={date.type} onSelected={setDateType} flex />
      </div>
    </ChartCard>
  );
};

export default K;
