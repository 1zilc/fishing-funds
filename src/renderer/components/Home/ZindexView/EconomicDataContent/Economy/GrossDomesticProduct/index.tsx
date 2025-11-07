import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@lib/enh/services';
import styles from './index.module.css';

interface GrossDomesticProductProps {}

const GrossDomesticProduct: React.FC<GrossDomesticProductProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);

  const { data: result = [], run: runGetEconomyIndexFromEastmoney } = useRequest(
    () =>
      Services.Zindex.GetEconomyIndexFromEastmoney('RPT_ECONOMY_GDP', 'REPORT_DATE,SUM_SAME,FIRST_SAME,SECOND_SAME,THIRD_SAME'),
    {
      ready: !!chartInstance,
    }
  );

  useRenderEcharts(
    () => {
      try {
        chartInstance?.setOption({
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
            position: 'inside',
          },
          legend: {
            top: 0,
            data: ['第一产业', '第二产业', '第三产业'],
            textStyle: {
              color: 'var(--main-text-color)',
              fontSize: 10,
            },
          },
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 32,
            outerBoundsMode: 'same',
            outerBoundsContain: 'axisLabel',
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLabel: {
              fontSize: 10,
            },
          },
          yAxis: [
            {
              type: 'value',
              scale: true,
              axisLabel: {
                fontSize: 10,
              },
              splitLine: {
                lineStyle: {
                  color: 'var(--border-color)',
                },
              },
            },
            {
              type: 'value',
              axisLabel: {
                fontSize: 10,
                formatter: `{value}%`,
              },
              splitLine: {
                lineStyle: {
                  color: 'var(--border-color)',
                },
              },
            },
          ],
          series: [
            {
              name: '第一产业',
              type: 'line',
              stack: '国内生产总值',
              smooth: true,
              lineStyle: {
                width: 1,
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
              },
              data: result.map((item: any) => [item.REPORT_DATE, item.FIRST_SAME]),
            },
            {
              name: '第二产业',
              type: 'line',
              stack: '国内生产总值',
              smooth: true,
              lineStyle: {
                width: 1,
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
              },
              data: result.map((item: any) => [item.REPORT_DATE, item.SECOND_SAME]),
            },
            {
              name: '第三产业',
              type: 'line',
              stack: '国内生产总值',
              smooth: true,
              lineStyle: {
                width: 1,
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
              },
              data: result.map((item: any) => [item.REPORT_DATE, item.THIRD_SAME]),
            },
            {
              type: 'line',
              name: '总值同比增长',
              showSymbol: false,
              lineStyle: { width: 1 },
              yAxisIndex: 1,
              data: result.map((item: any) => [item.REPORT_DATE, item.SUM_SAME]),
            },
          ],
        });
      } catch {}
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>国内生产总值(GDP)</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default GrossDomesticProduct;
