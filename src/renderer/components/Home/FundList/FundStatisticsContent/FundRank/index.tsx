import React, { useState } from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import TypeSelection from '@/components/TypeSelection';
import { getRemoteFundsMap, calcFund, calcWalletsFund } from '@/actions/fund';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

interface FundRankProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const rankTypeList = [
  { name: '今日收益', type: Enums.FundRankType.Sy, code: '' },
  { name: '今日收益率', type: Enums.FundRankType.Syl, code: '' },
];

const FundRank: React.FC<FundRankProps> = ({ funds = [], codes = [] }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    Math.max(CONST.DEFAULT.ECHARTS_SCALE, funds.length / 12)
  );
  const [rankType, setRankType] = useState(rankTypeList[0]);
  const { varibleColors, darkMode } = useHomeContext();

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
            return rankType.type === Enums.FundRankType.Sy
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
            formatter:
              rankType.type === Enums.FundRankType.Sy
                ? `{value}元`
                : rankType.type === Enums.FundRankType.Syl
                ? `{value}%`
                : '{value}',
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
                const calcA = calcFund(a);
                const calcB = calcFund(b);
                const calcWalletsA = calcWalletsFund(a, codes);
                const calcWalletsB = calcWalletsFund(b, codes);
                if (rankType.type === Enums.FundRankType.Sy) {
                  return calcWalletsA.jrsygz - calcWalletsB.jrsygz;
                } else {
                  return Number(calcA.gszzl) - Number(calcB.gszzl);
                }
              })
              .map((fund) => {
                const calcFundResult = calcFund(fund);
                const calcWalletsFundResult = calcWalletsFund(fund, codes);
                const value =
                  rankType.type === Enums.FundRankType.Sy
                    ? calcWalletsFundResult.jrsygz
                    : Number(calcFundResult.gszzl);
                return {
                  name: fund.name,
                  value: Math.abs(value).toFixed(2),
                  originValue: Number(value).toFixed(2),
                  label: {
                    show: true,
                  },
                  itemStyle: {
                    color:
                      value === 0
                        ? varibleColors['--reverse-text-color']
                        : value > 0
                        ? varibleColors['--increase-color']
                        : varibleColors['--reduce-color'],
                  },
                };
              }),
          },
        ],
      });
    },
    chartInstance,
    [darkMode, funds, rankType, codes]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />{' '}
      <TypeSelection
        types={rankTypeList}
        activeType={rankType.type}
        onSelected={setRankType}
      />
    </div>
  );
};

export default FundRank;
