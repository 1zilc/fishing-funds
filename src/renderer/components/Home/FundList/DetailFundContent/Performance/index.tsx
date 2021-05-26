import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';

import styles from './index.scss';

export interface PerformanceProps {
  code: string;
}
const performanceTypeList = [
  { name: '1月', type: Enums.PerformanceType.Month, code: 'm' },
  { name: '3月', type: Enums.PerformanceType.ThreeMonth, code: 'q' },
  { name: '6月', type: Enums.PerformanceType.HalfYear, code: 'hy' },
  { name: '1年', type: Enums.PerformanceType.Year, code: 'y' },
  { name: '3年', type: Enums.PerformanceType.ThreeYear, code: 'try' },
  { name: '最大', type: Enums.PerformanceType.Max, code: 'se' },
];
const Performance: React.FC<PerformanceProps> = ({ code }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );
  const [performanceType, setPerformanceType] = useState(
    performanceTypeList[2]
  );
  const { varibleColors, darkMode } = useHomeContext();
  const { run: runGetFundPerformanceFromEastmoney } = useRequest(
    Services.Fund.GetFundPerformanceFromEastmoney,
    {
      manual: true,
      throwOnError: true,
      cacheKey: `GetFundPerformanceFromEastmoney/${code}/${performanceType.code}`,
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
      },
    }
  );

  useRenderEcharts(
    () => {
      runGetFundPerformanceFromEastmoney(code, performanceType.code);
    },
    chartInstance,
    [darkMode, performanceType.code]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
      <div className={styles.selections}>
        {performanceTypeList.map((item) => (
          <div
            key={item.type}
            className={classnames(styles.selection, {
              [styles.active]: performanceType.type === item.type,
            })}
            onClick={() => setPerformanceType(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
