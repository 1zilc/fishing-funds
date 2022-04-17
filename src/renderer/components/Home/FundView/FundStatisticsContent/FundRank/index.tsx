import React, { useState } from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts, useCurrentWallet } from '@/utils/hooks';
import TypeSelection from '@/components/TypeSelection';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface FundRankProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const rankTypeList = [
  { name: '收益(今)', type: Enums.FundRankType.Sy, code: '' },
  { name: '收益率(今)', type: Enums.FundRankType.Syl, code: '' },
  { name: '持有收益', type: Enums.FundRankType.Cysy, code: '' },
  { name: '持有收益率', type: Enums.FundRankType.Cysyl, code: '' },
];

const FundRank: React.FC<FundRankProps> = ({ funds = [], codes = [] }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(Math.max(CONST.DEFAULT.ECHARTS_SCALE, funds.length / 12), true);
  const [rankType, setRankType] = useState(rankTypeList[0]);
  const { varibleColors, darkMode } = useHomeContext();
  const { currentWalletCode } = useCurrentWallet();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'shadow',
          },
          formatter: (datas: any[]) => {
            const {
              name,
              data: { originValue },
            } = datas[0];
            return rankType.type === Enums.FundRankType.Sy || rankType.type === Enums.FundRankType.Cysy
              ? `${name}：${originValue}元`
              : `${name}：${originValue}%`;
          },
        },
        legend: {
          show: false,
        },
        grid: {
          left: 0,
          right: 60,
          bottom: 0,
          top: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            formatter: rankType.type === Enums.FundRankType.Sy || rankType.type === Enums.FundRankType.Cysy ? `{value}元` : `{value}%`,
          },
        },
        yAxis: {
          type: 'category',
          data: funds.map((_, index) => index + 1).reverse(),
        },
        label: {
          show: true,
          formatter: '{b}',
          overflow: 'truncate',
          position: 'right',
          width: 60,
        },
        series: [
          {
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: funds
              .sort((a, b) => {
                const calcA = Helpers.Fund.CalcFund(a, currentWalletCode);
                const calcB = Helpers.Fund.CalcFund(b, currentWalletCode);
                const calcWalletsA = Helpers.Fund.CalcWalletsFund(a, codes);
                const calcWalletsB = Helpers.Fund.CalcWalletsFund(b, codes);
                if (rankType.type === Enums.FundRankType.Sy) {
                  return calcWalletsA.jrsygz - calcWalletsB.jrsygz;
                } else if (rankType.type === Enums.FundRankType.Syl) {
                  return Number(calcA.gszzl) - Number(calcB.gszzl);
                } else if (rankType.type === Enums.FundRankType.Cysy) {
                  return calcWalletsA.cysy - calcWalletsB.cysy;
                } else {
                  return calcWalletsA.cysyl - calcWalletsB.cysyl;
                }
              })
              .map((fund) => {
                const calcFundResult = Helpers.Fund.CalcFund(fund, currentWalletCode);
                const calcWalletsFundResult = Helpers.Fund.CalcWalletsFund(fund, codes);
                const value =
                  rankType.type === Enums.FundRankType.Sy
                    ? calcWalletsFundResult.jrsygz
                    : rankType.type === Enums.FundRankType.Syl
                    ? Number(calcFundResult.gszzl)
                    : rankType.type === Enums.FundRankType.Cysy
                    ? calcWalletsFundResult.cysy
                    : calcWalletsFundResult.cysyl;

                return {
                  name: fund.name,
                  value: Math.abs(value).toFixed(2),
                  originValue: Number(value).toFixed(2),
                  label: {
                    show: true,
                  },
                  itemStyle: {
                    color: Utils.GetValueColor(value).color,
                  },
                };
              }),
          },
        ],
      });
    },
    chartInstance,
    [darkMode, funds, rankType, codes, currentWalletCode]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
      <TypeSelection types={rankTypeList} activeType={rankType.type} onSelected={setRankType} />
    </div>
  );
};

export default FundRank;
