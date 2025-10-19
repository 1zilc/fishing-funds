import React from 'react';
import { useRequest } from 'ahooks';
import Color from 'color';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.css';

export interface RealTimeTransactionProps {
  code: string;
}

const RealTimeTransaction: React.FC<RealTimeTransactionProps> = ({ code = '' }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = {} as any, run: runGetTransactionFromEasymoney } = useRequest(
    () => Services.Quotation.GetTransactionFromEasymoney(code),
    {
      pollingInterval: 1000 * 60,
      refreshDeps: [code],
      ready: !!chartInstance,
    }
  );
  useRenderEcharts(
    ({ varibleColors }) => {
      chartInstance?.setOption({
        backgroundColor: 'transparent',
        title: {
          show: false,
        },
        grid: {
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '交易金额(亿)',
            type: 'pie',
            radius: '64%',
            center: ['50%', '50%'],
            data: [
              {
                name: '超大单流入',
                value: result.cddlr,
                itemStyle: {
                  color: Color(varibleColors['--increase-color']).toString(),
                },
              },
              {
                name: '大单流入',
                value: result.ddlr,
                itemStyle: {
                  color: Color(varibleColors['--increase-color']).alpha(0.9).toString(),
                },
              },
              {
                name: '中单流入',
                value: result.zdlr,
                itemStyle: {
                  color: Color(varibleColors['--increase-color']).alpha(0.8).toString(),
                },
              },
              {
                name: '小单流入',
                value: result.xdlr,
                itemStyle: {
                  color: Color(varibleColors['--increase-color']).alpha(0.7).toString(),
                },
              },
              {
                name: '小单流出',
                value: result.xdlc,
                itemStyle: {
                  color: Color(varibleColors['--reduce-color']).alpha(0.7).toString(),
                },
              },
              {
                name: '中单流出',
                value: result.zdlc,
                itemStyle: {
                  color: Color(varibleColors['--reduce-color']).alpha(0.8).toString(),
                },
              },
              {
                name: '大单流出',
                value: result.ddlc,
                itemStyle: {
                  color: Color(varibleColors['--reduce-color']).alpha(0.9).toString(),
                },
              },
              {
                name: '超大单流出',
                value: result.cddlc,
                itemStyle: {
                  color: Color(varibleColors['--reduce-color']).toString(),
                },
              },
            ],
            label: {
              color: 'var(--main-text-color)',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
              },
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: () => Math.random() * 200,
            itemStyle: {
              borderRadius: 10,
            },
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetTransactionFromEasymoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default RealTimeTransaction;
