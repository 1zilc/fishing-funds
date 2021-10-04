import React from 'react';
import { useBoolean } from 'ahooks';
import { Table } from 'antd';
import dayjs from 'dayjs';

import CustomDrawer from '@/components/CustomDrawer';
import FundHistoryValueContent from '@/components/Home/FundList/FundHistoryValueContent';
import * as Utils from '@/utils';
import styles from './index.scss';

const weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);
export interface HistoryValueProps {
  data?: { x: number; y: number; equityReturn: number; unitMoney: 0 }[];
}

const HistoryValue: React.FC<HistoryValueProps> = ({ data = [] }) => {
  const [
    showFundHistoryValueDrawer,
    { setTrue: openFundHistoryValueDrawer, setFalse: closeFundHistoryValueDrawer, toggle: ToggleFundHistoryValueDrawer },
  ] = useBoolean(false);
  const displayData = [...data].reverse().slice(0, 5);
  const columns = [
    {
      title: '日期',
      dataIndex: 'x',
      render: (text: number) => `${dayjs(text).format('YYYY-MM-DD')} ${Utils.GetWeekDay(dayjs(text).day())}`,
    },
    {
      title: '单位净值',
      dataIndex: 'y',
    },
    {
      title: '涨跌幅',
      dataIndex: 'equityReturn',

      render: (text: number) => <div className={Utils.GetValueColor(text).textClass}>{Utils.Yang(text)} %</div>,
    },
  ];

  return (
    <div className={styles.content}>
      <Table rowKey="x" size="small" columns={columns} dataSource={displayData} pagination={false} />
      <div className={styles.more}>
        <a onClick={openFundHistoryValueDrawer}>{'更多数据 >'}</a>
      </div>
      <CustomDrawer show={showFundHistoryValueDrawer}>
        <FundHistoryValueContent onEnter={closeFundHistoryValueDrawer} onClose={closeFundHistoryValueDrawer} data={data} />
      </CustomDrawer>
    </div>
  );
};

export default HistoryValue;
