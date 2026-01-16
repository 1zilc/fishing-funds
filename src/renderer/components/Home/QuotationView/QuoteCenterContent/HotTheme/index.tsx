import React, { PropsWithChildren, useState } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));

interface HotThemeProps {}

const HotTheme: React.FC<HotThemeProps> = () => {
  const { data: stockName, show: showAddStockDrawer, set: setAddStockDrawer, close: closeAddStockDrawer } = useDrawer('');

  const {
    data = [],
    loading,
    run: runQuotationGetHotThemeFromEastmoney,
  } = useRequest(Services.Quotation.GetHotThemeFromEastmoney);

  return (
    <ChartCard auto onFresh={runQuotationGetHotThemeFromEastmoney}>
      <div className={styles.content}>
        <Table
          rowKey="name"
          size="small"
          columns={[
            {
              title: '板块',
              dataIndex: 'name',
            },
            {
              title: '板块涨跌幅',
              dataIndex: 'zdf',
              render: (text: number) => <div className={Utils.GetValueColor(text).textClass}>{Utils.Yang(text)} %</div>,
              sorter: (a: any, b: any) => Number(a.zdf) - Number(b.zdf),
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
            placement: ['bottomCenter'],
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

export default HotTheme;
