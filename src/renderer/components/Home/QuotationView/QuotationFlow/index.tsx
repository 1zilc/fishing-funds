import React from 'react';

import { useAutoSizeEchart, useRenderEcharts, useEchartEventEffect } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.css';

interface QuotationFlowProps {
  onDetail: (code: string) => void;
  list: (Quotation.ResponseItem & Quotation.ExtraRow)[];
}

const QuotationFlow: React.FC<QuotationFlowProps> = (props) => {
  const { list } = props;
  const { ref: chartRef, chartInstance } = useAutoSizeEchart();

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
            nodeClick: false,
            roam: false,
            data: list.map((item) => {
              return {
                name: item.name,
                value: [item.zsz, item.zdf],
                itemStyle: {
                  color: Utils.GetValueMapColor(item.zdf || 0),
                },
                item,
              };
            }),
          },
        ],
      });
    },
    chartInstance,
    [list]
  );

  useEchartEventEffect(() => {
    chartInstance?.on('click', (params: any) => {
      const detailCode = params.data.item.code;
      props.onDetail(detailCode);
    });

    return () => {
      chartInstance?.off('click');
    };
  }, chartInstance);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default QuotationFlow;
