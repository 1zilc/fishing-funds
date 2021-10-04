import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

interface IndustryLayoutProps {
  code: string;
}

const IndustryLayout: React.FC<IndustryLayoutProps> = ({ code }) => {
  const [date, setDate] = useState('');
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();
  const { run: runGetIndustryRateFromEaseMoney } = useRequest(() => Services.Fund.GetIndustryRateFromEaseMoney(code), {
    throwOnError: true,
    onSuccess: (result) => {
      chartInstance?.setOption({
        tooltip: { show: true },
        series: [
          {
            height: '100%',
            width: '100%',
            type: 'treemap',
            breadcrumb: { show: false },
            roam: false,
            nodeClick: false,
            data: result.stocks
              .filter((stock) => stock.INDEXNAME !== '--')
              .map((stock) => {
                return {
                  name: stock.INDEXNAME,
                  value: Number(stock.JZBL),
                };
              })
              .concat([
                {
                  name: '其他行业',
                  value: result.stocks.filter((stock) => stock.INDEXNAME === '--').reduce((r, c) => r + Number(c.JZBL), 0),
                },
              ]),
          },
        ],
      });
      setDate(result.expansion);
    },
    refreshDeps: [varibleColors, darkMode, code],
    ready: !!chartInstance,
  });

  return (
    <ChartCard onFresh={runGetIndustryRateFromEaseMoney} TitleBar={<div className={styles.date}>{date}</div>}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default IndustryLayout;
