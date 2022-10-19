import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import ExportTitleBar from '@/components/ExportTitleBar';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useAppSelector, useRenderEcharts } from '@/utils/hooks';

import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

export interface PerformanceProps {
  code: string;
  name?: string;
}

const dateTypeList = [
  { name: '1天', type: 1, code: 1 },
  { name: '1周', type: 2, code: 7 },
  { name: '1月', type: 3, code: 30 },
  { name: '3月', type: 4, code: 90 },
  { name: '半年', type: 5, code: 180 },
  { name: '1年', type: 6, code: 365 },
];

const K: React.FC<PerformanceProps> = ({ code = '', name }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [date, setDateType] = useState(dateTypeList[2]);
  const coinUnitSetting = useAppSelector((state) => state.setting.systemSetting.coinUnitSetting);

  const { data: result = [], run: runGetKFromCoingecko } = useRequest(
    () => Services.Coin.GetKFromCoingecko(code, coinUnitSetting, date.code),
    {
      refreshDeps: [code, coinUnitSetting, date.code],
      ready: !!chartInstance,
    }
  );

  useRenderEcharts(
    () => {
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
            color: 'var(--main-text-color)',
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
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
          },
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
              color: 'var(--increase-color)',
              color0: 'var(--reduce-color)',
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
    chartInstance,
    [result]
  );

  return (
    <ChartCard onFresh={runGetKFromCoingecko} TitleBar={<ExportTitleBar name={name} data={result} />}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={dateTypeList} activeType={date.type} onSelected={setDateType} flex />
      </div>
    </ChartCard>
  );
};

export default K;
