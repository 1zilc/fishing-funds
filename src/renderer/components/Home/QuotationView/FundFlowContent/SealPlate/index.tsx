import React from 'react';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

interface SealPlateProps {}

const SealPlate: React.FC<SealPlateProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runQuotationGetTopicFBFailedFromEastmoney } = useRequest(
    Services.Quotation.GetTopicFBFailedFromEastmoney,
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
        legend: {
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 10,
          },
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
        yAxis: [
          {
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
          {
            type: 'value',
            axisLabel: {
              formatter: `{value}%`,
              fontSize: 10,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        grid: {
          top: 32,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        series: [
          {
            name: '炸板率',
            yAxisIndex: 1,
            data: result.map((i) => i.zbp.toFixed(2)),
            type: 'line',
            showSymbol: false,
            smooth: true,
          },
          {
            name: '封板未遂',
            data: result.map((i) => i.c),
            type: 'bar',
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard className={styles.content} onFresh={runQuotationGetTopicFBFailedFromEastmoney}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default SealPlate;
