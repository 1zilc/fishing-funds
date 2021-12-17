import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

import styles from './index.module.scss';

export interface PerformanceProps {
  code: string;
}
const performanceTypeList = [
  { name: '1月', type: Enums.PerformanceType.Month, code: 'm' },
  { name: '3月', type: Enums.PerformanceType.ThreeMonth, code: 'q' },
  { name: '6月', type: Enums.PerformanceType.HalfYear, code: 'hy' },
  { name: '1年', type: Enums.PerformanceType.Year, code: 'y' },
  { name: '3年', type: Enums.PerformanceType.ThreeYear, code: 'try' },
  { name: '成立', type: Enums.PerformanceType.Max, code: 'se' },
];
const Performance: React.FC<PerformanceProps> = ({ code }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [performanceType, setPerformanceType] = useState(performanceTypeList[2]);
  const { varibleColors, darkMode } = useHomeContext();
  const [ZDHC, setZDHC] = useState('');
  const { run: runGetFundPerformanceFromEastmoney } = useRequest(
    () => Services.Fund.GetFundPerformanceFromEastmoney(code, performanceType.code),
    {
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
            data: result?.map(({ name }) => name) || [],
            textStyle: {
              color: varibleColors['--main-text-color'],
              fontSize: 10,
            },
          },
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
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
              formatter: `{value}%`,
              fontSize: 10,
            },
          },
          dataZoom: [
            {
              type: 'inside',
              minValueSpan: 3600 * 24 * 1000 * 7,
            },
          ],
          series:
            result?.map((_, i) => ({
              ..._,
              type: 'line',
              showSymbol: false,
              symbol: 'none',
              lineStyle: {
                width: 1,
              },
              markPoint: i === 0 && {
                symbol: 'pin',
                symbolSize: 30,
                label: {
                  formatter: '{c}%',
                },
                data: [
                  { type: 'max', label: { fontSize: 10 } },
                  { type: 'min', label: { fontSize: 10 } },
                ],
              },
            })) || [],
        });
        try {
          const values = result?.[0]?.data.map(([time, rate]: any) => 1 + (1 * rate) / 100);
          setZDHC(Utils.CalcZDHC(values));
        } catch (error) {
          setZDHC('--');
        }
      },
      refreshDeps: [darkMode, code, performanceType.code],
      ready: !!chartInstance,
    }
  );

  return (
    <ChartCard
      onFresh={runGetFundPerformanceFromEastmoney}
      TitleBar={
        <div className={styles.zdhc}>
          {performanceType.name}最大回撤：<span>{ZDHC}%</span>
        </div>
      }
    >
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={performanceTypeList} activeType={performanceType.type} onSelected={setPerformanceType} />
      </div>
    </ChartCard>
  );
};

export default Performance;
