import React, { PropsWithChildren, useState } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface NorthHistoryProps {
  marketCode: string;
  reportName: string;
}

const { shell } = window.contextModules.electron;

const NorthHistory: React.FC<PropsWithChildren<NorthHistoryProps>> = (props) => {
  const { marketCode, reportName } = props;
  const [data, setData] = useState<News.ResponseItem[]>([]);

  const { loading } = useRequest(Services.Quotation.GetHodingFromEastmoney, {
    defaultParams: [marketCode, reportName],
    throwOnError: true,
    onSuccess: setData,
  });

  return (
    <div className={styles.content}>
      <Table
        rowKey="id"
        size="small"
        columns={[
          {
            title: '时间',
            width: 80,
            dataIndex: 'HOLD_DATE',
            render: (text: string) => <span className="text-center">{dayjs(text).format('YYYY-MM-DD')}</span>,
          },

          {
            title: '增持市值',
            dataIndex: 'ADD_MARKET_CAP',
            ellipsis: true,
            render: (text: string) => <span className={Utils.GetValueColor(text).textClass}>{text}亿</span>,
          },
          {
            title: '增持占比',
            dataIndex: 'ADD_MARKET_RATE',
            ellipsis: true,
            render: (text: number) => <span className={Utils.GetValueColor(text).textClass}>{text}‰</span>,
          },
          {
            title: '市值增持',
            dataIndex: 'ADD_MARKET_BNAME',
            ellipsis: true,
            render: (text: string) => <a>{text}</a>,
          },
          {
            title: '占比增持',
            dataIndex: 'BOARD_RATE_BNAME',
            ellipsis: true,
            render: (text: string) => <a>{text}</a>,
          },

          {
            title: '市值增持',
            dataIndex: 'ADD_MARKET_MNAME',
            ellipsis: true,
            render: (text: string) => <a>{text}</a>,
          },
          {
            title: '股数增持',
            dataIndex: 'ADD_SHARES_MNAME',
            ellipsis: true,
            render: (text: string) => <a>{text}</a>,
          },
          {
            title: '占比增持',
            dataIndex: 'MARKET_RATE_MNAME',
            ellipsis: true,
            render: (text: string) => <a>{text}</a>,
          },
        ]}
        dataSource={data}
        loading={loading}
        pagination={{
          defaultPageSize: 20,
          hideOnSinglePage: true,
          position: ['bottomCenter'],
        }}
        onRow={(record) => ({
          onClick: () => shell.openExternal(record.url_unique),
        })}
      />
    </div>
  );
};

export default NorthHistory;
