import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { IndicatorFormula } from 'hxc3-indicator-formula';

import ChartCard from '@/components/Card/ChartCard';
import ExportTitleBar from '@/components/ExportTitleBar';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface PerformanceProps {
  secid: string;
  name?: string;
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

const chartTypeList = [
  { name: 'MACD', type: 1, code: 1 },
  { name: 'KDJ', type: 2, code: 2 },
  { name: 'RSI', type: 3, code: 3 },
  { name: 'BIAS', type: 4, code: 4 },
];
const timeTypeList = [
  { name: '一年', type: 2, code: 360 },
  { name: '三年', type: 3, code: 1080 },
  { name: '五年', type: 4, code: 1800 },
  { name: '十年', type: 5, code: 3600 },
  { name: '最大', type: 6, code: 10000 },
];

const K: React.FC<PerformanceProps> = ({ secid = '', name }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE * 1.5, true);
  const [k, setKType] = useState(kTypeList[0]);
  const [chart, setChartType] = useState(chartTypeList[0]);
  const [time, setTimeType] = useState(timeTypeList[0]);
  const { data: result = [], run: runGetKFromEastmoney } = useRequest(() => Services.Stock.GetKFromEastmoney(secid, k.code, time.code), {
    refreshDeps: [secid, k.code, time.code],
    ready: !!chartInstance,
    cacheKey: Utils.GenerateRequestKey('Stock.GetKFromEastmoney', [secid, k.code, time.code]),
  });

  useRenderEcharts(
    ({ varibleColors }) => {
      // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
      const values = result.map((_) => [_.kp, _.sp, _.zd, _.zg]);
      const times = result.map((_) => _.date);
      const chartConfig: any[] = [];
      const standData = Utils.ConvertKData(result);

      if (chart.type === 1) {
        const MACD = IndicatorFormula.getClass('macd');
        const macdIndicator = new MACD();
        const macdData: any[] = macdIndicator.calculate(standData);
        Array.prototype.push.apply(chartConfig, [
          {
            name: 'MACD',
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: macdData.map((_) => _.MACD),
            itemStyle: {
              normal: {
                color: function (params: any) {
                  return params.data >= 0 ? varibleColors['--increase-color'] : varibleColors['--reduce-color'];
                },
              },
            },
            symbol: 'none',
          },
          {
            name: 'DIF',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: macdData.map((_) => _.DIFF),
            symbol: 'none',
          },
          {
            name: 'DEA',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: macdData.map((_) => _.DEA),
            symbol: 'none',
          },
        ]);
      }
      if (chart.type === 2) {
        const KDJ = IndicatorFormula.getClass('kdj');
        const kdjIndicator = new KDJ();
        const kdjData: any[] = kdjIndicator.calculate(standData);
        Array.prototype.push.apply(chartConfig, [
          {
            name: 'K',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: kdjData.map((_) => _.K),
            symbol: 'none',
          },
          {
            name: 'D',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: kdjData.map((_) => _.D),
            symbol: 'none',
          },
          {
            name: 'J',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: kdjData.map((_) => _.J),
            symbol: 'none',
          },
        ]);
      }
      if (chart.type === 3) {
        const RSI = IndicatorFormula.getClass('rsi');
        const rsiIndicator = new RSI();
        const rsiData: any[] = rsiIndicator.calculate(standData);
        Array.prototype.push.apply(chartConfig, [
          {
            name: 'RSI6',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: rsiData.map((_) => _.RSI6),
            symbol: 'none',
          },
          {
            name: 'RSI12',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: rsiData.map((_) => _.RSI12),
            symbol: 'none',
          },
          {
            name: 'RSI24',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: rsiData.map((_) => _.RSI24),
            symbol: 'none',
          },
        ]);
      }
      if (chart.type === 4) {
        const BIAS = IndicatorFormula.getClass('bias');
        const biasIndicator = new BIAS();
        const biasData: any[] = biasIndicator.calculate(standData);
        Array.prototype.push.apply(chartConfig, [
          {
            name: 'BIAS',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: biasData.map((_) => _.BIAS),
            symbol: 'none',
          },
          {
            name: 'BIAS2',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: biasData.map((_) => _.BIAS2),
            symbol: 'none',
          },
          {
            name: 'BIAS3',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: biasData.map((_) => _.BIAS3),
            symbol: 'none',
          },
        ]);
      }

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
        grid: [
          {
            left: 0,
            right: 0,
            top: 42,
            height: '50%',
            containLabel: true,
          },
          {
            left: 0,
            right: 0,
            top: '66%',
            height: '15%',
            containLabel: true,
          },
          {
            left: 0,
            right: 0,
            top: '84%',
            height: '15%',
            containLabel: true,
          },
        ],
        xAxis: [
          {
            data: times,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            splitNumber: 20,
            axisLabel: { show: true, fontSize: 10 },
          },
          {
            type: 'category',
            gridIndex: 1,
            data: times,
            axisLabel: { show: false },
          },
          {
            type: 'category',
            gridIndex: 2,
            data: times,
            axisLabel: { show: false },
          },
        ],
        yAxis: [
          {
            scale: true,
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
            axisLabel: { show: true, fontSize: 10 },
          },
          {
            gridIndex: 1,
            splitNumber: 3,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              show: true,
              formatter: Utils.ConvertBigNum,
              fontSize: 10,
            },
          },
          {
            scale: true,
            gridIndex: 2,
            splitNumber: 4,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: true, fontSize: 10 },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 80,
            end: 100,
          },
          {
            xAxisIndex: [0, 1],
            type: 'inside',
            start: 80,
            end: 100,
          },
          {
            xAxisIndex: [0, 2],
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
          {
            name: '成交量',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: result.map((_) => _.cjl),
            itemStyle: {
              normal: {
                color: function (params: any) {
                  const { zdf } = result[params.dataIndex];
                  return Number(zdf) > 0 ? varibleColors['--increase-color'] : varibleColors['--reduce-color'];
                },
              },
            },
          },
          ...chartConfig,
        ],
      });
    },
    chartInstance,
    [result, chart.type]
  );

  return (
    <ChartCard onFresh={runGetKFromEastmoney} TitleBar={<ExportTitleBar name={name} data={result} />}>
      <div className={styles.content}>
        <TypeSelection types={kTypeList} activeType={k.type} onSelected={setKType} colspan={6} />
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={chartTypeList} activeType={chart.type} onSelected={setChartType} colspan={6} />
        <TypeSelection types={timeTypeList} activeType={time.type} onSelected={setTimeType} flex />
      </div>
    </ChartCard>
  );
};

export default K;
