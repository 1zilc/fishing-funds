import React, { useState } from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts, useCurrentWallet } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface FundWarehouseProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const FundRank: React.FC<FundWarehouseProps> = ({ funds = [], codes = [] }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(Math.max(CONST.DEFAULT.ECHARTS_SCALE, funds.length / 12), true);
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
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            formatter: '{value}元',
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
                const calcWalletsA = Helpers.Fund.CalcWalletsFund(a, codes);
                const calcWalletsB = Helpers.Fund.CalcWalletsFund(b, codes);
                return calcWalletsA.cyje - calcWalletsB.cyje;
              })
              .map((fund) => {
                const calcWalletsFundResult = Helpers.Fund.CalcWalletsFund(fund, codes);
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
    [darkMode, funds, codes, currentWalletCode]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default FundRank;
