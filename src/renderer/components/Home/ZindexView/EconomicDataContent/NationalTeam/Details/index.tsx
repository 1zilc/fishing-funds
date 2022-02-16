import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

interface DetailsProps {}

const detailTypeList = [
  { name: '持股数量', type: 1, code: 'TOTAL_SHARES_SUM' },
  { name: '持股市值', type: 2, code: 'MARKET_CAP_SUM' },
  { name: '持股比例', type: 3, code: 'SHARES_RATIO_SUM' },
];

const Details: React.FC<DetailsProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(Math.max(CONST.DEFAULT.ECHARTS_SCALE, 15 / 12), true);
  const { darkMode, varibleColors } = useHomeContext();
  const [detailType, setDetailType] = useState(detailTypeList[0]);

  const { run: runZindexGetNationalTeamDetail } = useRequest(() => Services.Zindex.GetNationalTeamDetail(detailType.code), {
    onSuccess: (result) => {
      chartInstance?.setOption({
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['证金持股', '汇金持股', '证金资管持股'],
          textStyle: {
            color: varibleColors['--main-text-color'],
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 32,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            formatter: detailType.type === 3 ? `{value}%` : `{value}亿`,
          },
        },
        yAxis: {
          type: 'category',
          data: result.map(({ SECURITY_NAME_ABBR }) => SECURITY_NAME_ABBR),
        },
        series: [
          // 1
          {
            name: '证金持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ TOTALSHARES_SUM_0 }) => ((TOTALSHARES_SUM_0 || 0) / 10 ** 8).toFixed(2)),
          },
          {
            name: '汇金持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ TOTALSHARES_SUM_1 }) => ((TOTALSHARES_SUM_1 || 0) / 10 ** 8).toFixed(2)),
          },
          {
            name: '证金资管持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ TOTAL_SHARES_CHANGE }) => ((TOTAL_SHARES_CHANGE || 0) / 10 ** 8).toFixed(2)),
          },
          // 2
          {
            name: '证金持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ MARKETCAP_SUM_0 }) => ((MARKETCAP_SUM_0 || 0) / 10 ** 8).toFixed(2)),
          },
          {
            name: '汇金持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ MARKETCAP_SUM_1 }) => ((MARKETCAP_SUM_1 || 0) / 10 ** 8).toFixed(2)),
          },
          {
            name: '证金资管持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ MARKETCAP_SUM_2 }) => ((MARKETCAP_SUM_2 || 0) / 10 ** 8).toFixed(2)),
          },
          //3
          {
            name: '证金持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ SHARESRATIO_SUM_0 }) => (SHARESRATIO_SUM_0 || 0).toFixed(2)),
          },
          {
            name: '汇金持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ SHARESRATIO_SUM_1 }) => (SHARESRATIO_SUM_1 || 0).toFixed(2)),
          },
          {
            name: '证金资管持股',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            stack: 'total',
            data: result.map(({ SHARESRATIO_SUM_2 }) => (SHARESRATIO_SUM_2 || 0).toFixed(2)),
          },
        ].slice((detailType.type - 1) * 3, detailType.type * 3),
      });
    },
    refreshDeps: [darkMode, varibleColors, detailType],
    ready: !!chartInstance,
  });

  return (
    <ChartCard auto onFresh={runZindexGetNationalTeamDetail} TitleBar={<div className={styles.title}>个股明细</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
      <TypeSelection types={detailTypeList} activeType={detailType.type} onSelected={setDetailType} flex />
    </ChartCard>
  );
};

export default Details;
