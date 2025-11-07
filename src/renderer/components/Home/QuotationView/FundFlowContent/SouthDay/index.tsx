import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@lib/enh/services';

import styles from './index.module.css';

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
  const { data: result = { sh2hk: [], sz2hk: [], n2s: [] }, run: runGetSouthDayFromEastmoney } = useRequest(
    () => Services.Quotation.GetSouthDayFromEastmoney(fields1, dayType.code),
    {
      pollingInterval: 1000 * 60,
      refreshDeps: [dayType.code],
      ready: !!chartInstance,
    }
  );

  useRenderEcharts(
    () => {
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
          data: ['港股通(沪)', '港股通(深)', '南向'],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 24,
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
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}亿`,
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
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
    chartInstance,
    [result]
  );

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
