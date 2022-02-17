import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';

import styles from './index.module.scss';

export interface SouthDayProps {}

const fields1 = 'f2,f4,f6';

const dayTypeList = [
  { name: '净流入', type: 1, code: 'f51,f52' },
  { name: '资金余额', type: 2, code: 'f51,f53' },
  { name: '累计净流入', type: 3, code: 'f51,f54' },
];

const SouthDay: React.FC<SouthDayProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [dayType, setDayType] = useState(dayTypeList[0]);

  const { varibleColors, darkMode } = useHomeContext();
  const { run: runGetSouthDayFromEastmoney } = useRequest(() => Services.Quotation.GetSouthDayFromEastmoney(fields1, dayType.code), {
    pollingInterval: 1000 * 60,
    onSuccess: (result) => {
      chartInstance?.setOption({
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          position: 'inside',
        },
        legend: {
          data: ['港股通(沪)', '港股通(深)', '南向'],
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 24,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}亿`,
            fontSize: 10,
          },
        },
        dataZoom: [
          {
            type: 'inside',
            start: 90,
            end: 100,
            minValueSpan: 3600 * 24 * 1000 * 7,
          },
        ],
        series: [
          {
            type: 'line',
            name: '港股通(沪)',
            showSymbol: false,
            symbol: 'none',
            data: result.sh2hk,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: 'line',
            name: '港股通(深)',
            showSymbol: false,
            symbol: 'none',
            data: result.sz2hk,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: 'line',
            name: '南向',
            showSymbol: false,
            symbol: 'none',
            data: result.n2s,
          },
        ],
      });
    },
    refreshDeps: [darkMode, dayType.code],
    ready: !!chartInstance,
  });

  return (
    <ChartCard onFresh={runGetSouthDayFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={dayTypeList} activeType={dayType.type} onSelected={setDayType} />
      </div>
    </ChartCard>
  );
};

export default SouthDay;
