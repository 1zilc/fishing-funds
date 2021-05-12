import React from 'react';
import { useBoolean } from 'ahooks';
import { Table } from 'antd';

import CustomDrawer from '@/components/CustomDrawer';
import FundHistoryValueContent from '@/components/Home/FundList/FundHistoryValueContent';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface HistoryPerformanceProps {
  syl_1n?: string;
  syl_6y?: string;
  syl_3y?: string;
  syl_1y?: string;
  data?: { x: number; y: number; equityReturn: number; unitMoney: 0 }[];
}

const HistoryPerformance: React.FC<HistoryPerformanceProps> = (props) => {
  const [
    showFundHistoryValueDrawer,
    {
      setTrue: openFundHistoryValueDrawer,
      setFalse: closeFundHistoryValueDrawer,
      toggle: ToggleFundHistoryValueDrawer,
    },
  ] = useBoolean(false);

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

    {
      timeName: '近一年',
      zdf: props.syl_1n,
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
      <div className={styles.more}>
        <a onClick={openFundHistoryValueDrawer}>{'详细数据 >'}</a>
      </div>
      <CustomDrawer show={showFundHistoryValueDrawer}>
        <FundHistoryValueContent
          onEnter={closeFundHistoryValueDrawer}
          onClose={closeFundHistoryValueDrawer}
          data={props.data}
        />
      </CustomDrawer>
    </div>
  );
};

export default HistoryPerformance;
