import React from 'react';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import { useSelector } from 'react-redux';
import { StoreState } from '@/reducers/types';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

interface GeographyProps {}

const Geography: React.FC<GeographyProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();
  const quotations = useSelector((state: StoreState) => state.quotation.quotations);

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        tooltip: {
          show: true,
        },
        series: [
          {
            name: '中国',
            type: 'map',
            mapType: 'china',
            selectedMode: false,
            itemStyle: {
              normal: { label: { show: false }, borderColor: varibleColors['--background-color'] },
            },
            emphasis: {
              label: { show: true, color: varibleColors['--main-text-color'] },
              itemStyle: {
                areaColor: varibleColors['--primary-color'],
              },
            },
            roam: true,
            data: quotations
              .filter((quotation) => quotation.type === Enums.QuotationType.Area)
              .map((quotation) => {
                return {
                  name: quotation.name.replace('板块', ''),
                  value: quotation.zdf,
                  itemStyle: {
                    areaColor: Utils.GetValueMapColor(quotation.zdf || 0),
                  },
                };
              }),
          },
        ],
      });
    },
    chartInstance,
    [varibleColors, darkMode]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Geography;
