import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import TypeSelection from '@/components/TypeSelection';
import ExportTitleBar from '@/components/ExportTitleBar';
import ChartCard from '@/components/Card/ChartCard';
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

const Trend: React.FC<PerformanceProps> = ({ code, name }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [date, setDateType] = useState(dateTypeList[1]);
  const coinUnitSetting = useAppSelector((state) => state.setting.systemSetting.coinUnitSetting);

  const { data: result = { prices: [], vol24h: [] }, run: runGetHistoryFromCoingecko } = useRequest(
    () => Services.Coin.GetHistoryFromCoingecko(code, coinUnitSetting, date.code),
    {
      pollingInterval: CONST.DEFAULT.ESTIMATE_FUND_DELAY,
      refreshDeps: [code, coinUnitSetting, date.code],
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
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          top: 20,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          data: result.prices.map(({ time }) => time),
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              fontSize: 10,
            },
            scale: true,
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
            },
            scale: true,
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
        ],
        series: [
          {
            data: result.prices.map(({ time, price }) => [time, price]),
            type: 'line',
            name: `价格 ${coinUnitSetting}`,
            showSymbol: false,
            symbol: 'none',
            smooth: true,
            markPoint: {
              symbol: 'pin',
              symbolSize: 30,
              data: [
                { type: 'max', label: { fontSize: 10 } },
                { type: 'min', label: { fontSize: 10 } },
              ],
            },
          },
          {
            data: result.vol24h.map(({ time, price }) => [time, price]),
            yAxisIndex: 1,
            type: 'bar',
            name: `24H交易量 (亿)`,
            smooth: true,
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard onFresh={runGetHistoryFromCoingecko} TitleBar={<ExportTitleBar name={name} data={result.prices} />}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={dateTypeList} activeType={date.type} onSelected={setDateType} flex />
      </div>
    </ChartCard>
  );
};

export default Trend;
