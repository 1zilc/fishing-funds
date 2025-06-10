import React from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import HistoryBar from '@/components/Home/FundView/FundHistoryValueContent/HistoryBar';
import * as Utils from '@/utils';
import styles from './index.module.css';

export interface HistoryValueProps {
  data?: { x: number; y: number; equityReturn: number; unitMoney: 0 }[];
  onEnter: () => void;
  onClose: () => void;
}

const FundHistoryValueContent: React.FC<HistoryValueProps> = (props) => {
  const { data = [] } = props;
  const displayData = [...data].reverse();
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
    <CustomDrawerContent title="历史净值" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <ChartCard>
          <HistoryBar data={data} />
        </ChartCard>
        <ChartCard auto>
          <Table
            rowKey="x"
            size="small"
            columns={columns}
            dataSource={displayData}
            pagination={{
              defaultPageSize: 20,
              hideOnSinglePage: true,
              position: ['bottomCenter'],
            }}
          />
        </ChartCard>
      </div>
    </CustomDrawerContent>
  );
};

export default FundHistoryValueContent;
