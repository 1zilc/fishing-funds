import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.scss';

export interface PerformanceProps {
  code: string;
}
const trendTypeList = [
  { name: '一天', type: 1, code: 1 },
  { name: '两天', type: 2, code: 2 },
  { name: '三天', type: 3, code: 3 },
  { name: '四天', type: 4, code: 4 },
  { name: '五天', type: 5, code: 5 },
];
const Trend: React.FC<PerformanceProps> = ({ code }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );
  const [trend, setTrendType] = useState(trendTypeList[0]);
  const { darkMode, varibleColors } = useHomeContext();
  const { run: runGetTrendFromEastmoney } = useRequest(
    Services.Zindex.GetTrendFromEastmoney,
    {
      manual: true,
      throwOnError: true,
      cacheKey: `GetTrendFromEastmoney/${code}/${trend.code}`,
      onSuccess: (result = []) => {
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
            top: 15,
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: result?.map(({ time, price }) => time) || [],
            boundaryGap: false,
            axisLabel: {
              fontSize: 10,
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: `{value}`,
              fontSize: 10,
            },
            scale: true,
          },
          dataZoom: [
            {
              type: 'inside',
              minValueSpan: 3600 * 24 * 1000 * 1,
            },
          ],
          series: [
            {
              data: result.map(({ time, price }) => [time, price]),
              type: 'line',
              name: '价格',
              showSymbol: false,
              symbol: 'none',
              lineStyle: {
                width: 1,
                color:
                  result[result.length - 1]?.price < result[0]?.price
                    ? varibleColors['--reduce-color']
                    : varibleColors['--increase-color'],
              },
            },
          ],
        });
      },
    }
  );

  useRenderEcharts(
    () => {
      runGetTrendFromEastmoney(code, trend.code);
    },
    chartInstance,
    [darkMode, code, trend.code]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
      <div className={styles.selections}>
        {trendTypeList.map((item) => (
          <div
            key={item.type}
            className={classnames(styles.selection, {
              [styles.active]: trend.type === item.type,
            })}
            onClick={() => setTrendType(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trend;
