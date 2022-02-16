import React from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

interface GrossDomesticProductProps {}

const GrossDomesticProduct: React.FC<GrossDomesticProductProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);
  const { varibleColors, darkMode } = useHomeContext();

  const { run: runGetEconomyIndexFromEastmoney } = useRequest(() => Services.Zindex.GetEconomyIndexFromEastmoney(20), {
    onSuccess: (result) => {
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
            data: ['第一产业', '第二产业', '第三产业'],
            textStyle: {
              color: varibleColors['--main-text-color'],
              fontSize: 10,
            },
          },
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 32,
            containLabel: true,
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
            },
            {
              type: 'value',
              axisLabel: {
                fontSize: 10,
                formatter: `{value}%`,
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
              data: result.map((item: any) => [item[0], item[3]]),
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
              data: result.map((item: any) => [item[0], item[5]]),
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
              data: result.map((item: any) => [item[0], item[7]]),
            },
            {
              type: 'line',
              name: '总值同比增长',
              showSymbol: false,
              lineStyle: { width: 1 },
              yAxisIndex: 1,
              data: result.map((item: any) => [item[0], item[2]]),
            },
          ],
        });
      } catch {}
    },
    refreshDeps: [darkMode],
    ready: !!chartInstance,
  });

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>国内生产总值(GDP)</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default GrossDomesticProduct;
