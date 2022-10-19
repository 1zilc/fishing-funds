import React from 'react';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

interface LeekTrendProps {}

const LeekTrend: React.FC<LeekTrendProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = [], run: runQuotationGetGBTrendFromEastmoney } = useRequest(Services.Quotation.GetGBTrendFromEastmoney, {
    ready: !!chartInstance,
  });
  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        xAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 10,
          },
          axisLine: { show: false },
          axisTick: { show: false },
          data: result.map((i) => i.name),
        },
        yAxis: {
          type: 'value',
          axisLabel: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        series: [
          {
            name: '情绪指数',
            data: result.map((i) => i.val.toFixed(2)),
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: {
              width: 1,
            },
            markArea: {
              silent: true,
              data: [
                [
                  {
                    name: '看多',
                    yAxis: 0,
                    itemStyle: {
                      color: 'var(--increase-bg-color)',
                    },
                    label: {
                      position: 'insideLeft',
                      color: 'var(--increase-color)',
                    },
                  },
                  {
                    yAxis: 1,
                  },
                ],
                [
                  {
                    name: '看空',
                    yAxis: 0,
                    itemStyle: {
                      color: 'var(--reduce-color)',
                    },
                    label: {
                      position: 'insideLeft',
                      color: 'var(--reduce-color)',
                    },
                  },
                  {
                    yAxis: -1,
                  },
                ],
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
    <ChartCard
      TitleBar={<div className={styles.titleBar}>股吧情绪指数</div>}
      className={styles.content}
      onFresh={runQuotationGetGBTrendFromEastmoney}
      describe="股吧情绪指数是通过分析全体用户的发帖情绪，用来衡量股吧情绪波动状况的综合指数。"
    >
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default LeekTrend;
