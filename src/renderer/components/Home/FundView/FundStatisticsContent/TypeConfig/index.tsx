import React from 'react';

import { useResizeEchart, useRenderEcharts, useAppSelector } from '@/utils/hooks';

import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface TypeConfigProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
}

const TypeConfig: React.FC<TypeConfigProps> = ({ funds = [] }) => {
  const remoteFunds = useAppSelector((state) => state.fund.remoteFunds);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  useRenderEcharts(
    () => {
      const remoteFundsMap = Utils.GetCodeMap(remoteFunds, 0);
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
              const calcFundResult = Helpers.Fund.CalcFund(fund, fundConfigCodeMap);
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
            borderColor: 'var(--background-color)',
            borderWidth: 1,
          },
          label: {
            color: 'var(--background-color)',
          },
        },
      });
    },
    chartInstance,
    [funds, fundConfigCodeMap, remoteFunds]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default TypeConfig;
