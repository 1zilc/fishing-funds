import React, { PropsWithChildren, useState } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));

interface RecentHotProps {}

const RecentHot: React.FC<RecentHotProps> = () => {
  const { data: stockName, show: showAddStockDrawer, set: setAddStockDrawer, close: closeAddStockDrawer } = useDrawer('');

  const {
    data = [],
    loading,
    run: runQuotationGetRecentHotFromEastmoney,
  } = useRequest(Services.Quotation.GetRecentHotFromEastmoney);

  return (
    <ChartCard auto onFresh={runQuotationGetRecentHotFromEastmoney}>
      <div className={styles.content}>
        <Table
          rowKey="name"
          size="small"
          columns={[
            {
              title: '排名',
              render: (text: string, record, number) => number + 1,
            },
            {
              title: '板块',
              dataIndex: 'name',
            },
            {
              title: '个股',
              dataIndex: 'stockName',
              render: (text: string) => <a>{text}</a>,
            },
          ]}
          dataSource={data}
          loading={loading}
          pagination={{
            defaultPageSize: 20,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
          onRow={(record) => ({
            onClick: () => setAddStockDrawer(record.stockName),
          })}
        />
        <CustomDrawer show={showAddStockDrawer}>
          <AddStockContent onEnter={closeAddStockDrawer} onClose={closeAddStockDrawer} defaultName={stockName} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};

export default RecentHot;
