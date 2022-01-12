import React from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

interface OilPriceProps {}

const OilPrice: React.FC<OilPriceProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);
  const { varibleColors, darkMode } = useHomeContext();

  const { run: runGetOilPriceFromEastmoney } = useRequest(() => Services.Zindex.GetOilPriceFromEastmoney(), {
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
            data: ['NYMEX原油', '汽油', '柴油'],
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
                formatter: `{value}美元/桶`,
              },
            },
            {
              type: 'value',
              scale: true,
              axisLabel: {
                fontSize: 10,
                formatter: `{value}元/吨`,
              },
            },
          ],
          series: [
            {
              type: 'line',
              name: 'NYMEX原油',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item) => [item.date, item.close]),
            },
            {
              type: 'line',
              name: '汽油',
              showSymbol: false,
              yAxisIndex: 1,
              lineStyle: { width: 1 },
              data: result.map((item) => [item.date, item.qy]),
            },
            {
              type: 'line',
              name: '柴油',
              showSymbol: false,
              yAxisIndex: 1,
              lineStyle: { width: 1 },
              data: result.map((item) => [item.date, item.cy]),
            },
          ],
        });
      } catch {}
    },
    refreshDeps: [darkMode],
    ready: !!chartInstance,
  });

  return (
    <ChartCard auto onFresh={runGetOilPriceFromEastmoney} TitleBar={<div className={styles.title}>油价</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default OilPrice;
