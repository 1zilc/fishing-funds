import React from 'react';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

interface ComparisonProps {}

const Comparison: React.FC<ComparisonProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runQuotationGetTopicZDTCountFromEastmoney } = useRequest(
    Services.Quotation.GetTopicZDTCountFromEastmoney,
    {
      ready: !!chartInstance,
    }
  );
  useRenderEcharts(
    ({ varibleColors }) => {
      chartInstance?.setOption({
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 10,
          },
          data: result.map((i) =>
            dayjs()
              .set('hours', Math.round(i.t / 100))
              .set('minutes', i.t % 100)
              .format('HH:mm')
          ),
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: varibleColors['--border-color'],
            },
          },
        },
        grid: {
          top: 5,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        series: [
          {
            name: '涨停数',
            data: result.map((i) => i.ztc),
            type: 'line',
            showSymbol: false,
            smooth: true,
            itemStyle: {
              color: varibleColors['--increase-color'],
            },
          },
          {
            name: '跌停数',
            data: result.map((i) => i.dtc),
            type: 'line',
            showSymbol: false,
            smooth: true,
            itemStyle: {
              color: varibleColors['--reduce-color'],
            },
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard className={styles.content} onFresh={runQuotationGetTopicZDTCountFromEastmoney}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default Comparison;
