import React from 'react';
import { Table } from 'antd';

import * as Utils from '@/utils';
import styles from './index.scss';

export interface HistoryPerformanceProps {
  syl_6y?: string;
  syl_3y?: string;
  syl_1y?: string;
}

const HistoryPerformance: React.FC<HistoryPerformanceProps> = (props) => {
  const columns = [
    {
      title: '时间区间',
      dataIndex: 'timeName',
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

  const data = [
    {
      timeName: '近一月',
      zdf: props.syl_1y,
    },

    {
      timeName: '近三月',
      zdf: props.syl_3y,
    },

    {
      timeName: '近六月',
      zdf: props.syl_6y,
    },
  ];

  return (
    <div className={styles.content}>
      <Table
        size="small"
        rowKey="timeName"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default HistoryPerformance;
