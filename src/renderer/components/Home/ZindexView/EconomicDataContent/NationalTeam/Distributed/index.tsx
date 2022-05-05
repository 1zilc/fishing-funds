import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useRenderEcharts, useResizeEchart } from '@/utils/hooks';
import * as Services from '@/services';
import styles from './index.module.scss';

interface DistributedProps {}

const Distributed: React.FC<DistributedProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);

  const {
    data: result = {
      MARKETCAPRATIO_SUM_0: 0,
      MARKETCAPRATIO_SUM_1: 0,
      MARKETCAPRATIO_SUM_2: 0,
      REPORT_DATE: '',
    },
    run: runZindexGetNationalTeamDistributed,
  } = useRequest(Services.Zindex.GetNationalTeamDistributed, {
    ready: !!chartInstance,
  });

  useRenderEcharts(
    ({ varibleColors }) => {
      chartInstance?.setOption({
        backgroundColor: 'transparent',
        title: {
          show: false,
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '持仓占比',
            type: 'pie',
            radius: '64%',
            center: ['50%', '50%'],
            data: [
              {
                value: result.MARKETCAPRATIO_SUM_0.toFixed(2),
                name: '证金持股',
              },
              {
                value: result.MARKETCAPRATIO_SUM_1.toFixed(2),
                name: '汇金持股',
              },
              {
                value: result.MARKETCAPRATIO_SUM_2.toFixed(2),
                name: '证金资管持股',
              },
            ],
            label: {
              color: varibleColors['--main-text-color'],
            },
            labelLine: {
              lineStyle: {
                color: varibleColors['--main-text-color'],
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: varibleColors['--background-color'],
              borderWidth: 1,
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: () => Math.random() * 200,
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard
      auto
      onFresh={runZindexGetNationalTeamDistributed}
      TitleBar={<div className={styles.title}>{result.REPORT_DATE.slice(0, 10)}</div>}
    >
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default Distributed;
