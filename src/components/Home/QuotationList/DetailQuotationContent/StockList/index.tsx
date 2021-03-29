import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { Table } from 'antd';
import dayjs from 'dayjs';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface HistoryValueProps {
  code: string;
}

const StockList: React.FC<HistoryValueProps> = ({ code }) => {
  const [stockList, setStockList] = useState([]);

  const { loading: listLoading } = useRequest(
    Services.Quotation.GetStocksFromEasymoney,
    {
      throwOnError: true,
      defaultParams: [code],
      onSuccess: setStockList,
    }
  );

  const columns = [
    {
      title: '代码',
      dataIndex: 'f12',
    },
    {
      title: '名称',
      dataIndex: 'f14',
    },
    {
      title: '最新价',
      dataIndex: 'f2',
    },
    {
      title: '涨跌幅',
      dataIndex: 'f3',
      align: 'right',
      render: (text: number) => (
        <div className={text < 0 ? 'text-down' : 'text-up'}>
          {Utils.Yang(text)} %
        </div>
      ),
    },
  ];

  return (
    <div className={styles.content}>
      <Table
        loading={listLoading}
        rowKey="x"
        size="small"
        columns={columns}
        dataSource={stockList}
        pagination={{
          defaultPageSize: 20,
          hideOnSinglePage: true,
          position: ['bottomCenter'],
        }}
      />
    </div>
  );
};

export default StockList;
