import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import classnames from 'classnames';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface GlobalBondProps {}

const GlobalBond: React.FC<PropsWithChildren<GlobalBondProps>> = () => {
  const [data, setData] = useState<any[]>([]);

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
      render: (text: string, record: any) => <span className={classnames(Utils.GetValueColor(record.percent).textClass)}>{text}</span>,
      sorter: (a: any, b: any) => Number(a.price) - Number(b.price),
    },
    {
      title: '涨跌幅',
      dataIndex: 'percent',
      render: (text: string, record: any) => <span className={classnames(Utils.GetValueColor(record.percent).textClass)}>{text}%</span>,
      sorter: (a: any, b: any) => Number(a.percent) - Number(b.percent),
    },
  ];

  const { run: runGetGlobalBondFromEastmoney, loading } = useRequest(Services.Exchange.GetGlobalBondFromEastmoney, {
    onSuccess: setData,
  });

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
            position: ['bottomCenter'],
          }}
        />
      </div>
    </ChartCard>
  );
};

export default GlobalBond;
