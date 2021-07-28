import React, { useState } from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import TypeSelection from '@/components/TypeSelection';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

interface WalletIncomeProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const incomeTypeList = [
  { name: '今日收益', type: Enums.WalletIncomType.Jrsy, code: '' },
  { name: '持有收益', type: Enums.WalletIncomType.Cysy, code: '' },
];

const WalletIncome: React.FC<WalletIncomeProps> = ({ funds = [], codes = [] }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [incomeType, setIncomeType] = useState(incomeTypeList[0]);

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
          data: codes.map((code) => Helpers.Wallet.GetCurrentWallet(code).name),
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
            data: codes.map((code) => {
              const { sygz, cysy } = Helpers.Fund.CalcFunds(funds, code);
              const value = incomeType.type === Enums.WalletIncomType.Jrsy ? sygz.toFixed(2) : cysy.toFixed(2);
              return {
                value,
                itemStyle: {
                  color: Utils.GetValueColor(value).color,
                },
              };
            }),
          },
        ],
        barMaxWidth: 20,
      });
    },
    chartInstance,
    [darkMode, funds, codes, incomeType]
  );

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%' }} />
      <TypeSelection types={incomeTypeList} activeType={incomeType.type} onSelected={setIncomeType} />
    </div>
  );
};

export default WalletIncome;
