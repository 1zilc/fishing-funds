import React, { useState } from 'react';

import { useResizeEchart, useRenderEcharts, useAppSelector } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

interface WalletConfigProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const WalletConfig: React.FC<WalletConfigProps> = ({ funds, codes }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);

  useRenderEcharts(
    () => {
      const walletsName = codes.map((code) => Helpers.Wallet.GetCurrentWalletConfig(code, walletsConfig).name);
      chartInstance?.setOption(
        {
          tooltip: {
            trigger: 'item',
            confine: true,
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            top: 0,
            data: funds.map(({ name }) => name),
            textStyle: {
              color: 'var(--main-text-color)',
              fontSize: 10,
              overflow: 'truncate',
              width: 50,
            },
            itemWidth: 6,
            itemHeight: 2,
            type: 'scroll',
            pageIconSize: 10,
            pageTextStyle: {
              color: 'var(--main-text-color)',
              fontSize: 10,
            },
          },
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 32,
            outerBoundsMode: 'same',
            outerBoundsContain: 'axisLabel',
          },
          xAxis: {
            type: 'category',
            data: walletsName,
            axisLabel: {
              fontSize: 10,
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: `{value}元`,
              fontSize: 10,
            },
            splitLine: {
              lineStyle: {
                color: 'var(--border-color)',
              },
            },
          },
          series: funds.map((fund) => {
            return {
              name: fund.name,
              type: 'bar',
              emphasis: {
                focus: 'series',
              },
              stack: walletsName.join(','),
              data: codes.map((code) => {
                const { codeMap } = Helpers.Fund.GetFundConfig(code, walletsConfig);
                const calcFundResult = Helpers.Fund.CalcFund(fund, codeMap);
                return calcFundResult.cyje.toFixed(2);
              }),
            };
          }),
          barMaxWidth: 20,
        },
        true
      );
    },
    chartInstance,
    [funds, codes, walletsConfig]
  );

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default WalletConfig;
