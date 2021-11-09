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
              normal: { label: { show: false }, borderColor: varibleColors['--main-text-color'] },
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
                const alphas = [0.6, 0.7, 0.8, 0.9, 1];
                const alphaindex = Math.ceil(Math.min(Math.abs(quotation.zdf), 5));
                const colorAlpha = quotation.zdf === 0 ? 1 : alphas[alphaindex];
                const color = Utils.GetValueColor(quotation.zdf).color;
                const rgba = Utils.ColorRgba(color, colorAlpha);
                return {
                  name: quotation.name.replace('板块', ''),
                  value: quotation.zdf,
                  itemStyle: {
                    areaColor: rgba,
                    color: rgba,
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
