import React from 'react';

import { useResizeEchart, useRenderEcharts, useNativeThemeColor } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

interface IndustryLayoutProps {
  stocks: any[];
}

const IndustryLayout: React.FC<IndustryLayoutProps> = ({ stocks }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors } = useNativeThemeColor();

  useRenderEcharts(
    () => {
      const groupMap: Record<string, any[]> = stocks.reduce((map, data) => {
        if (!map[data.INDEXNAME]) {
          map[data.INDEXNAME] = [];
        }
        map[data.INDEXNAME].push(data);
        return map;
      }, {});

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
            data: Object.entries(groupMap).map(([key, datas]) => ({
              name: key,
              value: datas.reduce((r, c) => r + Number(c.JZBL), 0),
            })),
          },
        ],
      });
    },
    chartInstance,
    [stocks]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default IndustryLayout;
