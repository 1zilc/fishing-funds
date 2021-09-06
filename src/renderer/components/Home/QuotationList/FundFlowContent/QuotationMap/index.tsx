import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import { useSelector } from 'react-redux';
import { StoreState } from '@/reducers/types';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.scss';

interface QuotationMapProps {}

const QuotationMap: React.FC<QuotationMapProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();
  const quotations = useSelector((state: StoreState) => state.quotation.quotations);

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        tooltip: {
          formatter: (item: any) => {
            const { name, zdf } = item.data;
            return `${name}：${Utils.Yang(zdf)}%`;
          },
        },
        series: [
          {
            height: '100%',
            width: '100%',
            type: 'treemap',
            breadcrumb: { show: false },
            data: quotations.map((quotation) => {
              const alphas = [0.6, 0.7, 0.8, 0.9, 1];
              const alphaindex = Math.ceil(Math.min(Math.abs(quotation.zdf), 5));
              const colorAlpha = quotation.zdf === 0 ? 1 : alphas[alphaindex];
              const color = Utils.GetValueColor(quotation.zdf).color;
              const rgba = Utils.ColorRgba(color, colorAlpha);
              return {
                name: quotation.name,
                value: quotation.zsz,
                zdf: quotation.zdf,
                itemStyle: {
                  color: rgba,
                },
              };
            }),
          },
        ],
      });
    },
    chartInstance,
    [varibleColors, darkMode, quotations]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default QuotationMap;
