import React from 'react';
import { useRequest } from 'ahooks';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

interface SankeyProps {
  data: (Fund.ResponseItem & Fund.FixData & { stocks: { GPJC: string; JZBL: string; INDEXNAME: string }[] })[];
  valueKey: 'GPJC' | 'INDEXNAME';
  length: number;
}

const Sankey: React.FC<SankeyProps> = ({ data, valueKey, length }) => {
  // 20个股票1层高度
  const height = data.reduce((r, c) => r + c.stocks.length, 0) / 20;
  const { ref: chartRef, chartInstance } = useResizeEchart(Math.max(height, length / 2), true);
  const names = Array.from(new Set(data.map((item) => [item.name, ...item.stocks.map((item) => item[valueKey])]).flat()));

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        series: {
          type: 'sankey',
          layout: 'none',
          nodeGap: 0,
          nodeWidth: 80,
          left: 0,
          bottom: 0,
          top: 0,
          draggable: false,
          emphasis: {
            focus: 'adjacency',
          },
          data: names.map((name) => ({ name })),
          links: data
            .map((item) =>
              item.stocks.map((stock) => ({
                source: item.name,
                target: stock[valueKey],
                value: Number(stock.JZBL),
              }))
            )
            .flat(),
        },
      });
    },
    chartInstance,
    [data, valueKey]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default Sankey;
