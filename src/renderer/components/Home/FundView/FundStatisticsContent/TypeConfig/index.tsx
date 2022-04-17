import React from 'react';
import { useSelector } from 'react-redux';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts, useCurrentWallet } from '@/utils/hooks';
import { StoreState } from '@/reducers/types';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface TypeConfigProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
}

const TypeConfig: React.FC<TypeConfigProps> = ({ funds = [] }) => {
  const remoteFunds = useSelector((state: StoreState) => state.fund.remoteFunds);
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();
  const { currentWalletCode } = useCurrentWallet();

  useRenderEcharts(
    () => {
      const remoteFundsMap = remoteFunds.reduce((m, c) => {
        m[c[0]] = c;
        return m;
      }, {} as Record<string, Fund.RemoteFund>);
      const typeMap: Record<string, Fund.ResponseItem[]> = {};
      funds.forEach((fund) => {
        const type = remoteFundsMap[fund.fundcode!]?.[3];
        if (!typeMap[type]) {
          typeMap[type] = [fund];
        } else {
          typeMap[type].push(fund);
        }
      });
      chartInstance?.setOption({
        color: ['#5470c6', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: {
          type: 'sunburst',
          data: Object.entries(typeMap).map(([type, funds]) => ({
            name: type,
            children: funds.map((fund) => {
              const calcFundResult = Helpers.Fund.CalcFund(fund, currentWalletCode);
              return {
                name: calcFundResult.name,
                value: 1,
                label: {
                  color: Utils.GetValueColor(calcFundResult.gszzl!).color,
                },
              };
            }),
          })),
          levels: [
            {},
            {
              r0: '10%',
              r: '60%',
              itemStyle: {
                borderWidth: 1,
              },
              label: { fontSize: 10 },
            },
            {
              r0: '60%',
              r: '64%',
              label: {
                position: 'outside',
                silent: false,
                fontSize: 10,
              },
              itemStyle: {
                borderWidth: 1,
              },
            },
          ],
          itemStyle: {
            borderRadius: 10,
            borderColor: varibleColors['--background-color'],
            borderWidth: 1,
          },
          label: {
            color: varibleColors['--background-color'],
          },
        },
      });
    },
    chartInstance,
    [darkMode, funds, currentWalletCode, remoteFunds]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default TypeConfig;
