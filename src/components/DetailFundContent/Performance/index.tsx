import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useRequest, useSize } from 'ahooks';
import * as echarts from 'echarts';

import { useNativeThemeColor } from '@/utils/hooks';
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
  const performanceRef = useRef<HTMLDivElement>(null);
  const [
    performanceChartInstance,
    setPerformanceChartInstance,
  ] = useState<echarts.ECharts | null>(null);
  const [performanceType, setPerformanceType] = useState(
    performanceTypeList[2]
  );
  const { width: performanceRefWidth } = useSize(performanceRef);
  const { colors: varibleColors, darkMode } = useNativeThemeColor(
    CONST.VARIBLES
  );
  const { run: runGetFundPerformanceFromEastmoney } = useRequest(
    Services.Fund.GetFundPerformanceFromEastmoney,
    {
      manual: true,
      throwOnError: true,
      onSuccess: (result) => {
        performanceChartInstance?.setOption({
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
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
            right: 5,
            bottom: 0,
            containLabel: true,
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            nameTextStyle: {},
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
            },
          ],
          series:
            result?.map((_) => ({
              ..._,
              type: 'line',
              showSymbol: false,
              symbol: 'none',
              lineStyle: {
                width: 1,
              },
            })) || [],
        });
      },
    }
  );
  const initPerformanceChart = () => {
    const performanceChartInstance = echarts.init(performanceRef.current!);
    setPerformanceChartInstance(performanceChartInstance);
  };

  useEffect(initPerformanceChart, []);

  useEffect(() => {
    runGetFundPerformanceFromEastmoney(code, performanceType.code);
  }, [darkMode, performanceChartInstance, performanceType.code]);

  useEffect(() => {
    performanceChartInstance?.resize({
      height: (performanceRefWidth! * 250) / 400,
    });
  }, [performanceRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={performanceRef} style={{ width: '100%' }}></div>
      <div className={styles.performanceSelections}>
        {performanceTypeList.map((item) => (
          <div
            key={item.type}
            className={classnames(styles.performanceSelection, {
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
