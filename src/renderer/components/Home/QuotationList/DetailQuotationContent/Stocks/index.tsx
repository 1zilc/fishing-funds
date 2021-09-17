import React, { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import { Table } from 'antd';

import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface StocksProps {
  code: string;
}

const Stocks: React.FC<StocksProps> = ({ code }) => {
  const [stockList, setStockList] = useState<any[]>([]);
  const { data: secid, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const { loading: listLoading, run: runGetStocksFromEasymoney } = useRequest(Services.Quotation.GetStocksFromEasymoney, {
    throwOnError: true,
    pollingInterval: 1000 * 60,
    defaultParams: [code],
    onSuccess: (result) => {
      result.sort((a, b) => b.zdf - a.zdf);
      setStockList(result);
    },
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
    {
      title: '最新价',
      dataIndex: 'zxj',
    },
    {
      title: '涨跌幅',
      dataIndex: 'zdf',
      render: (text: number) => <div className={Utils.GetValueColor(text).textClass}>{Utils.Yang(text)} %</div>,
    },
  ];

  const freshChart = useCallback(() => {
    runGetStocksFromEasymoney(code);
  }, [code]);

  return (
    <ChartCard auto onFresh={freshChart}>
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
          onRow={(record) => ({
            onClick: () => setDetailDrawer(`${record.market}.${record.code}`),
          })}
        />
        <CustomDrawer show={showDetailDrawer}>
          <DetailStockContent onClose={closeDetailDrawer} onEnter={closeDetailDrawer} secid={secid} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};

export default Stocks;
