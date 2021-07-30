import React, { useState } from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

interface WalletConfigProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const WalletConfig: React.FC<WalletConfigProps> = ({ funds, codes }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      const walletsName = codes.map((code) => Helpers.Wallet.GetCurrentWalletConfig(code).name);
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
            show: true,
            data: funds.map(({ name }) => name),
            textStyle: {
              color: varibleColors['--main-text-color'],
              fontSize: 10,
              overflow: 'truncate',
              width: 50,
            },
            itemWidth: 6,
            itemHeight: 2,
            type: 'scroll',
            pageIconSize: 10,
            pageTextStyle: {
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
                const calcFundResult = Helpers.Fund.CalcFund(fund, code);
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
    [darkMode, funds, codes]
  );

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default WalletConfig;
