import React, { useState } from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import TypeSelection from '@/components/TypeSelection';
import { getRemoteFundsMap, calcFund, calcFunds } from '@/actions/fund';
import { getCurrentWallet } from '@/actions/wallet';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

interface WalletIncomeProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const WalletIncome: React.FC<WalletIncomeProps> = ({
  funds = [],
  codes = [],
}) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );

  const { darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          show: false,
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: codes.map((code) => getCurrentWallet(code).name),
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
        series: [
          {
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: codes
              .map((code) => {
                const { sygz } = calcFunds(funds, code);
                return {
                  value: sygz.toFixed(2),
                  itemStyle: {
                    color: Utils.GetValueColor(sygz).color,
                  },
                };
              })
              .sort((a, b) => Number(a.value) - Number(b.value)),
          },
        ],
        barMaxWidth: 20,
      });
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

export default WalletIncome;
