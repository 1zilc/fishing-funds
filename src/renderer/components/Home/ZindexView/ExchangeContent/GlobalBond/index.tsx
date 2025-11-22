import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import clsx from 'clsx';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

interface GlobalBondProps {}

const GlobalBond: React.FC<PropsWithChildren<GlobalBondProps>> = () => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a: any, b: any) => b.name.localeCompare(a.name, 'zh'),
    },
    {
      title: '最新价',
      dataIndex: 'price',
      render: (text: string, record: any) => <span className={clsx(Utils.GetValueColor(record.percent).textClass)}>{text}</span>,
      sorter: (a: any, b: any) => Number(a.price) - Number(b.price),
    },
    {
      title: '涨跌幅',
      dataIndex: 'percent',
      render: (text: string, record: any) => <span className={clsx(Utils.GetValueColor(record.percent).textClass)}>{text}%</span>,
      sorter: (a: any, b: any) => Number(a.percent) - Number(b.percent),
    },
  ];

  const { data = [], run: runGetGlobalBondFromEastmoney, loading } = useRequest(Services.Exchange.GetGlobalBondFromEastmoney);

  return (
    <ChartCard auto onFresh={runGetGlobalBondFromEastmoney}>
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
            placement: ['bottomCenter'],
          }}
        />
      </div>
    </ChartCard>
  );
};

export default GlobalBond;
