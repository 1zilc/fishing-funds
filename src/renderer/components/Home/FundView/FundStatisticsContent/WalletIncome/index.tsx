import React, { useState } from 'react';

import { useResizeEchart, useRenderEcharts, useAppSelector } from '@/utils/hooks';
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
  { name: '收益(今)', type: Enums.WalletIncomType.Jrsy, code: '' },
  { name: '收益率(今)', type: Enums.WalletIncomType.Jrsyl, code: '' },
  { name: '持有收益', type: Enums.WalletIncomType.Cysy, code: '' },
  { name: '持有收益率', type: Enums.WalletIncomType.Cysyl, code: '' },
];

const WalletIncome: React.FC<WalletIncomeProps> = ({ funds = [], codes = [] }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [incomeType, setIncomeType] = useState(incomeTypeList[0]);

  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);

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
          data: codes.map((code) => Helpers.Wallet.GetCurrentWalletConfig(code, walletsConfig).name),
          axisLabel: {
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: `{value}${
              incomeType.type === Enums.WalletIncomType.Jrsy || incomeType.type === Enums.WalletIncomType.Cysy ? '元' : '%'
            }`,
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
          },
        },
        series: [
          {
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: codes.map((code) => {
              const { codeMap } = Helpers.Fund.GetFundConfig(code, walletsConfig);
              const { sygz, gssyl, cysy, cysyl } = Helpers.Fund.CalcFunds(funds, codeMap);
              const values = {
                [Enums.WalletIncomType.Jrsy]: sygz.toFixed(2),
                [Enums.WalletIncomType.Jrsyl]: gssyl.toFixed(2),
                [Enums.WalletIncomType.Cysy]: cysy.toFixed(2),
                [Enums.WalletIncomType.Cysyl]: cysyl.toFixed(2),
              };
              const value = values[incomeType.type];
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
    [funds, codes, incomeType, walletsConfig]
  );

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%' }} />
      <TypeSelection types={incomeTypeList} activeType={incomeType.type} onSelected={setIncomeType} />
    </div>
  );
};

export default WalletIncome;
