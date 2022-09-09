import React from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { useResizeEchart, useRenderEcharts, useDrawer, useEchartEventEffect } from '@/utils/hooks';
import styles from './index.module.scss';

const DetailFundContent = React.lazy(() => import('@/components/Home/FundView/DetailFundContent'));
const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));

interface SankeyProps {
  data: (Fund.ResponseItem & Fund.FixData & { stocks: { GPJC: string; JZBL: string; INDEXNAME: string }[] })[];
  valueKey: 'GPJC' | 'INDEXNAME';
  length: number;
}

const Sankey: React.FC<SankeyProps> = ({ data, valueKey, length }) => {
  // 20个股票1层高度
  const height = data.reduce((r, c) => r + c.stocks.length, 0) / 20;
  const { ref: chartRef, chartInstance } = useResizeEchart(Math.max(height, length / 2), true);
  const dataSource = Object.values(
    data.reduce<Record<string, any>>((map, item) => {
      map[item.name!] = { name: item.name, item };
      return item.stocks.reduce<Record<string, any>>((map, item) => {
        map[item[valueKey]] = { name: item[valueKey], item };
        return map;
      }, map);
    }, {})
  );

  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');
  const { data: stockName, show: showAddStockDrawer, set: setAddStockDrawer, close: closeAddStockDrawer } = useDrawer('');

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
          data: dataSource,
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
    [data, valueKey, dataSource]
  );

  useEchartEventEffect(() => {
    chartInstance?.on('click', (params: any) => {
      if (!params.data.item.INDEXCODE) {
        const detailCode = params.data.item.fundcode;
        setDetailDrawer(detailCode);
      }
      if (params.data.item.INDEXCODE && valueKey === 'GPJC') {
        const stockName = params.data.item.GPJC;
        setAddStockDrawer(stockName);
      }
      if (params.data.item.INDEXCODE && valueKey === 'INDEXNAME') {
        // 板块详情暂时无法查看
      }
    });

    return () => {
      chartInstance?.off('click');
    };
  }, chartInstance);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCode} />
      </CustomDrawer>
      <CustomDrawer show={showAddStockDrawer}>
        <AddStockContent onEnter={closeAddStockDrawer} onClose={closeAddStockDrawer} defaultName={stockName} />
      </CustomDrawer>
    </div>
  );
};

export default Sankey;
