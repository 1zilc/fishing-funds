import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export interface AssetsConfigProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const AssetsConfig: React.FC<AssetsConfigProps> = ({ funds, codes }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        backgroundColor: 'transparent',
        title: {
          show: false,
        },
        grid: {
          left: 0,
          right: 5,
          bottom: 0,
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        series: [
          {
            name: '持有金额',
            type: 'pie',
            radius: '64%',
            center: ['50%', '50%'],
            data: codes.map((code) => {
              const { zje } = Helpers.Fund.CalcFunds(funds, code);
              const { name } = Helpers.Wallet.GetCurrentWallet(code);
              return {
                value: zje.toFixed(2),
                name,
              };
            }),
            label: {
              color: varibleColors['--main-text-color'],
            },
            labelLine: {
              lineStyle: {
                color: varibleColors['--main-text-color'],
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: varibleColors['--background-color'],
              borderWidth: 1,
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: () => Math.random() * 200,
          },
        ],
      });
    },
    chartInstance,
    [darkMode, codes, funds]
  );

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default AssetsConfig;
