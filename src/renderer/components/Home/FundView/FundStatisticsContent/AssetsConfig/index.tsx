import React from 'react';

import { useResizeEchart, useRenderEcharts, useAppSelector } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export interface AssetsConfigProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const AssetsConfig: React.FC<AssetsConfigProps> = ({ funds, codes }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);

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
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
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
              const { codeMap } = Helpers.Fund.GetFundConfig(code, walletsConfig);
              const { zje } = Helpers.Fund.CalcFunds(funds, codeMap);
              const { name } = Helpers.Wallet.GetCurrentWalletConfig(code, walletsConfig);
              return {
                value: zje.toFixed(2),
                name,
              };
            }),
            label: {
              color: 'var(--main-text-color)',
            },
            labelLine: {
              lineStyle: {
                color: 'var(--main-text-color)',
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: 'var(--background-color)',
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
    [codes, funds, walletsConfig]
  );

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default AssetsConfig;
