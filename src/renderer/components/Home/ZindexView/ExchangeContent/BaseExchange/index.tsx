import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import classnames from 'classnames';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface BaseExchangeProps {}

const BaseExchange: React.FC<PropsWithChildren<BaseExchangeProps>> = () => {
  const [data, setData] = useState<Exchange.ResponseItem[]>([]);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a: any, b: any) => b.name.localeCompare(a.name, 'zh'),
    },
    {
      title: '最新价',
      dataIndex: 'zxj',
      render: (text: string, record: Exchange.ResponseItem) => (
        <span className={classnames(Utils.GetValueColor(record.zxj - record.zs).textClass)}>{text}</span>
      ),
      sorter: (a: any, b: any) => Number(a.zxj) - Number(b.zxj),
    },
    {
      title: '涨跌幅',
      dataIndex: 'zdf',
      render: (text: string, record: Exchange.ResponseItem) => (
        <span className={classnames(Utils.GetValueColor(record.zdf).textClass)}>{text}%</span>
      ),
      sorter: (a: any, b: any) => Number(a.zdf) - Number(b.zdf),
    },
  ];

  const { run: runGetListFromEastmoney, loading } = useRequest(() => Services.Exchange.GetListFromEastmoney('0', 'b:MK0300'), {
    onSuccess: setData,
  });

  return (
    <ChartCard auto onFresh={runGetListFromEastmoney}>
      <div className={styles.content}>
        <Table
          rowKey="code"
          size="small"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            defaultPageSize: 20,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </ChartCard>
  );
};

export default BaseExchange;
