import React from 'react';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface DistributionProps {}

const categorys = new Array(21).fill('').map((_, i) => `${-10 + i}%`);

const Distribution: React.FC<DistributionProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runQuotationGetDistributionFromEastmoney } = useRequest(Services.Quotation.GetDistributionFromEastmoney, {
    ready: !!chartInstance,
  });
  useRenderEcharts(
    ({ varibleColors }) => {
      chartInstance?.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            axisLabel: { interval: 21, padding: [0, 10, 0, 0] },
            axisLine: { show: false },
            axisTick: { show: false },
            data: ['跌停', ...categorys, '涨停'],
          },
          {
            type: 'value',
            gridIndex: 1,
            max: 'dataMax',
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
            axisLabel: {
              fontSize: 10,
            },
          },
          {
            type: 'category',
            gridIndex: 1,
            data: ['涨跌分布'],
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
          },
        ],
        grid: [
          {
            top: 5,
            left: 0,
            right: 0,
            bottom: '25%',
            containLabel: true,
          },
          {
            top: '80%',
            left: 0,
            right: 0,
            bottom: 0,
          },
        ],
        series: [
          {
            type: 'bar',
            data: result.map((item) => {
              return {
                name: item.name === '-11' ? '跌停' : item.name === '11' ? '涨停' : `${item.value}%`,
                value: item.value,
                stack: 'total',
                itemStyle: {
                  color: Utils.GetValueColor(item.name).color,
                },
              };
            }),
          },
          {
            name: '下跌',
            type: 'bar',
            stack: '涨跌',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barWidth: 8,
            label: {
              show: true,
              position: 'top',
              distance: 2,
              color: varibleColors['--reduce-color'],
            },
            itemStyle: {
              color: varibleColors['--reduce-color'],
              borderRadius: [5, 0, 0, 5],
            },
            data: result.reduce(
              (r, c) => {
                r[0] += Number(c.name) < 0 ? c.value : 0;
                return r;
              },
              [0]
            ),
          },
          {
            name: '平家',
            type: 'bar',
            stack: '涨跌',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barWidth: 8,
            label: {
              show: true,
              position: 'top',
              distance: 2,
              color: varibleColors['--reverse-text-color'],
            },
            itemStyle: {
              color: varibleColors['--reverse-text-color'],
            },
            data: result.reduce(
              (r, c) => {
                r[0] += Number(c.name) === 0 ? c.value : 0;
                return r;
              },
              [0]
            ),
          },
          {
            name: '上涨',
            type: 'bar',
            stack: '涨跌',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barWidth: 8,
            label: {
              show: true,
              position: 'top',
              distance: 2,
              color: varibleColors['--increase-color'],
            },
            itemStyle: {
              color: varibleColors['--increase-color'],
              borderRadius: [0, 5, 5, 0],
            },
            data: result.reduce(
              (r, c) => {
                r[0] += Number(c.name) > 0 ? c.value : 0;
                return r;
              },
              [0]
            ),
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard className={styles.content} onFresh={runQuotationGetDistributionFromEastmoney}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default Distribution;
