import React from 'react';

import { useResizeEchart, useRenderEcharts, useFundConfigMap } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

interface FundOverviewProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const FundOverview: React.FC<FundOverviewProps> = (props) => {
  const { funds, codes } = props;
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const fundConfigMap = useFundConfigMap(codes);

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        tooltip: {
          formatter: (item: any) => {
            const { name, value } = item.data;
            return `${name}：${Utils.Yang(value[1])}%`;
          },
        },
        series: [
          {
            height: '100%',
            width: '100%',
            type: 'treemap',
            breadcrumb: { show: false },
            data: funds.map((fund) => {
              const calcWalletsFundResult = Helpers.Fund.CalcWalletsFund(fund, fundConfigMap);
              return {
                name: fund.name,
                value: [calcWalletsFundResult.cyje, fund.gszzl || 0],
                itemStyle: {
                  color: Utils.GetValueMapColor(fund.gszzl || 0),
                },
              };
            }),
          },
        ],
      });
    },
    chartInstance,
    [codes, fundConfigMap]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default FundOverview;
