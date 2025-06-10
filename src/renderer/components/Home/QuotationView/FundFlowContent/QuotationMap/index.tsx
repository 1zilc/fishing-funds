import React from 'react';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts, useAppSelector } from '@/utils/hooks';

import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import styles from './index.module.css';

interface QuotationMapProps {
  type: Enums.QuotationType;
}

const QuotationMap: React.FC<QuotationMapProps> = ({ type }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const quotations = useAppSelector((state) => state.quotation.quotations);

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
            data: quotations
              .filter((quotation) => quotation.type === type)
              .map((quotation) => {
                return {
                  name: quotation.name,
                  value: [quotation.zsz, quotation.zdf],
                  itemStyle: {
                    color: Utils.GetValueMapColor(quotation.zdf || 0),
                  },
                };
              }),
          },
        ],
      });
    },
    chartInstance,
    [quotations, type]
  );

  return (
    <ChartCard>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default QuotationMap;
