import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';

import ChartCard from '@/components/Card/ChartCard';
import { useHomeContext } from '@/components/Home';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import { StoreState } from '@/reducers/types';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

export interface PerformanceProps {
  code: string;
}

const dateTypeList = [
  { name: '1天', type: 1, code: 1 },
  { name: '1周', type: 2, code: 7 },
  { name: '1月', type: 3, code: 30 },
  { name: '3月', type: 4, code: 90 },
  { name: '半年', type: 5, code: 180 },
  { name: '1年', type: 6, code: 365 },
];

const K: React.FC<PerformanceProps> = ({ code = '' }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const coinUnitSetting = useSelector((state: StoreState) => state.setting.systemSetting.coinUnitSetting);
  const [date, setDateType] = useState(dateTypeList[2]);
  const { varibleColors, darkMode } = useHomeContext();
  const { run: runGetKFromCoingecko } = useRequest(() => Services.Coin.GetKFromCoingecko(code, coinUnitSetting, date.code), {
    onSuccess: (result) => {
      // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
      const values = result.map((_) => [_.kp, _.sp, _.zd, _.zg]);
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
          data: ['K线'],
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: result.map(({ time }) => time),
        },
        yAxis: {
          scale: true,
        },
        dataZoom: [
          {
            type: 'inside',
            start: 80,
            end: 100,
          },
        ],
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: values,
            itemStyle: {
              color: varibleColors['--increase-color'],
              color0: varibleColors['--reduce-color'],
            },
            markPoint: {
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
                {
                  name: '平均值',
                  type: 'average',
                  valueDim: 'close',
                },
              ],
            },
          },
        ],
      });
    },
    refreshDeps: [darkMode, code, coinUnitSetting, date.code],
    ready: !!chartInstance,
  });

  return (
    <ChartCard onFresh={runGetKFromCoingecko}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={dateTypeList} activeType={date.type} onSelected={setDateType} flex />
      </div>
    </ChartCard>
  );
};

export default K;
