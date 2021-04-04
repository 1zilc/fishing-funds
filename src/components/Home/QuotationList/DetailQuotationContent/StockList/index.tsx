import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { Table } from 'antd';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface StockListProps {
  code: string;
}

const StockList: React.FC<StockListProps> = ({ code }) => {
  const [stockList, setStockList] = useState<any[]>([]);

  const { loading: listLoading } = useRequest(
    Services.Quotation.GetStocksFromEasymoney,
    {
      throwOnError: true,
      pollingInterval: 1000 * 60,
      defaultParams: [code],
      cacheKey: `GetStocksFromEasymoney/${code}`,
      onSuccess: (result) => {
        result.sort((a, b) => b.zdf - a.zdf);
        setStockList(result);
      },
    }
  );

  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '最新价',
      dataIndex: 'zxj',
    },
    {
      title: '涨跌幅',
      dataIndex: 'zdf',
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
        rowKey="code"
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
