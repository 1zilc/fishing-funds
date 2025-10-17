import React, { useState } from 'react';

import { useResizeEchart, useRenderEcharts, useAppSelector } from '@/utils/hooks';
import TypeSelection from '@/components/TypeSelection';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

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
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);

  useRenderEcharts(
    () => {
      const codeMaps = Helpers.Fund.GetFundConfigMaps(codes, walletsConfig);
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
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            formatter:
              rankType.type === Enums.FundRankType.Sy || rankType.type === Enums.FundRankType.Cysy ? `{value}元` : `{value}%`,
          },
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
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
                const calcA = Helpers.Fund.CalcFund(a, fundConfigCodeMap);
                const calcB = Helpers.Fund.CalcFund(b, fundConfigCodeMap);
                const calcWalletsA = Helpers.Fund.CalcWalletsFund(a, codeMaps);
                const calcWalletsB = Helpers.Fund.CalcWalletsFund(b, codeMaps);
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
                const calcFundResult = Helpers.Fund.CalcFund(fund, fundConfigCodeMap);
                const calcWalletsFundResult = Helpers.Fund.CalcWalletsFund(fund, codeMaps);
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
    [funds, rankType, codes, fundConfigCodeMap, walletsConfig]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
      <TypeSelection types={rankTypeList} activeType={rankType.type} onSelected={setRankType} colspan={12} />
    </div>
  );
};

export default FundRank;
