import React from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@/services';
import styles from './index.module.scss';

interface NationalStockTradingStatisticsProps {}

const NationalStockTradingStatistics: React.FC<NationalStockTradingStatisticsProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.4);

  const { data: result = [], run: runGetEconomyIndexFromEastmoney } = useRequest(
    () =>
      Services.Zindex.GetEconomyIndexFromEastmoney(
        'RPT_ECONOMY_STOCK_STATISTICS',
        'REPORT_DATE,TIME,TOTAL_SHARES_SH,TOTAL_MARKE_SH,DEAL_AMOUNT_SH,VOLUME_SH,HIGH_INDEX_SH,LOW_INDEX_SH,TOTAL_SZARES_SZ,TOTAL_MARKE_SZ,DEAL_AMOUNT_SZ,VOLUME_SZ,HIGH_INDEX_SZ,LOW_INDEX_SZ'
      ),
    {
      ready: !!chartInstance,
    }
  );

  useRenderEcharts(
    () => {
      try {
        chartInstance?.setOption({
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
            position: 'inside',
          },
          legend: {
            data: ['上海成交', '深圳成交'],
            textStyle: {
              color: 'var(--main-text-color)',
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
            type: 'time',
            boundaryGap: false,
            axisLabel: {
              fontSize: 10,
            },
          },
          yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
              fontSize: 10,
              formatter: `{value}亿`,
            },
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
          series: [
            {
              type: 'line',
              name: '上海成交',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.DEAL_AMOUNT_SH]),
            },
            {
              type: 'line',
              name: '深圳成交',
              showSymbol: false,
              lineStyle: { width: 1 },
              data: result.map((item: any) => [item.REPORT_DATE, item.DEAL_AMOUNT_SZ]),
            },
          ],
        });
      } catch {}
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetEconomyIndexFromEastmoney} TitleBar={<div className={styles.title}>全国股票交易统计</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default NationalStockTradingStatistics;
