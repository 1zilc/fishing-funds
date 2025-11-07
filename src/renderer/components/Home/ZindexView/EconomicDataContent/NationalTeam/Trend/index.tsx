import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import TypeSelection from '@/components/TypeSelection';

import { useRenderEcharts, useResizeEchart } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@lib/enh/services';
import styles from './index.module.css';

interface TrendProps {}

const trendTypeList = [
  { name: '持股数量', type: 1, code: 1 },
  { name: '持股市值', type: 2, code: 2 },
  { name: '占市场总和比例', type: 3, code: 3 },
];

const Trend: React.FC<TrendProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [trendType, setTrendType] = useState(trendTypeList[0]);

  const { data: result = [], run: runZindexGetNationalTeamTrend } = useRequest(Services.Zindex.GetNationalTeamTrend, {
    refreshDeps: [trendType],
    ready: !!chartInstance,
  });

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
          data: [trendType.name, '沪深300'],
          textStyle: {
            color: 'var(--main-text-color)',
            fontSize: 10,
          },
        },
        grid: {
          top: 32,
          left: 0,
          right: 0,
          bottom: 0,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: result.map(({ REPORT_DATE }) => REPORT_DATE.slice(0, 10)),
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: `{value}${trendType.code === 1 ? '亿' : trendType.code === 2 ? '万亿' : ''}`,
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
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
        ],
        series: [
          {
            type: 'line',
            name: trendType.name,
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              width: 1,
            },
            data: result.map(({ TOTAL_SHARES, HOLD_MARKET_CAP, SHARES_RATIO }) => {
              switch (trendType.code) {
                case 1:
                  return (TOTAL_SHARES / 10 ** 8).toFixed(2);
                case 2:
                  return (HOLD_MARKET_CAP / 10 ** 12).toFixed(2);
                case 3:
                  return (SHARES_RATIO * 100).toFixed(2);
              }
            }),
          },
          {
            type: 'line',
            showSymbol: false,
            name: '沪深300',
            symbol: 'none',
            yAxisIndex: 1,
            lineStyle: {
              width: 1,
            },
            data: result.map(({ INDEX_NAME }) => INDEX_NAME),
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runZindexGetNationalTeamTrend} TitleBar={<div className={styles.title}>持股走势</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
      <TypeSelection types={trendTypeList} activeType={trendType.type} onSelected={setTrendType} flex />
    </ChartCard>
  );
};

export default Trend;
