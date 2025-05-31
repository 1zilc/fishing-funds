import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { Table } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

const DetailStockContent = React.lazy(() => import('@/components/Home/StockView/DetailStockContent'));
export interface StocksProps {
  secid: string;
}

const Stocks: React.FC<StocksProps> = ({ secid }) => {
  const { data: detailSecid, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const {
    data: stockList = [],
    loading,
    run: runGetIndustryFromEastmoney,
  } = useRequest(() => Services.Stock.GetIndustryFromEastmoney(secid, 2), {
    pollingInterval: 1000 * 60,
    refreshDeps: [secid],
  });

  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>,
    },
  ];

  return (
    <ChartCard auto onFresh={runGetIndustryFromEastmoney}>
      <div className={styles.content}>
        <Table
          loading={loading}
          rowKey="code"
          size="small"
          columns={columns}
          dataSource={stockList}
          pagination={{
            defaultPageSize: 20,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
          onRow={(record) => ({
            onClick: () => setDetailDrawer(record.secid),
          })}
        />
        <CustomDrawer show={showDetailDrawer}>
          <DetailStockContent onClose={closeDetailDrawer} onEnter={closeDetailDrawer} secid={detailSecid} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};

export default Stocks;
