import React, { useState } from 'react';

import { useResizeEchart, useRenderEcharts, useAppSelector } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

interface FundWarehouseProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const FundRank: React.FC<FundWarehouseProps> = ({ funds = [], codes = [] }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(Math.max(CONST.DEFAULT.ECHARTS_SCALE, funds.length / 12), true);
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
              data: { value },
            } = datas[0];
            return `${name}：${value}元`;
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
            formatter: '{value}元',
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
                const calcWalletsA = Helpers.Fund.CalcWalletsFund(a, codeMaps);
                const calcWalletsB = Helpers.Fund.CalcWalletsFund(b, codeMaps);
                return calcWalletsA.cyje - calcWalletsB.cyje;
              })
              .map((fund) => {
                const calcWalletsFundResult = Helpers.Fund.CalcWalletsFund(fund, codeMaps);
                return {
                  name: fund.name,
                  value: calcWalletsFundResult.cyje.toFixed(2),
                  label: {
                    show: true,
                  },
                };
              }),
          },
        ],
      });
    },
    chartInstance,
    [funds, codes]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default FundRank;
