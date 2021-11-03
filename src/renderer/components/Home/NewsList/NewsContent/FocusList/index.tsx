import React, { PropsWithChildren, useState } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import * as Services from '@/services';
import styles from './index.module.scss';

interface FocusListProps {}

const { shell } = window.contextModules.electron;

const FocusList: React.FC<PropsWithChildren<FocusListProps>> = () => {
  const [data, setData] = useState<News.ResponseItem[]>([]);

  const { loading } = useRequest(Services.News.GetFocusList, {
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
            dataIndex: 'showtime',
            width: 50,
            render: (text: string) => <span className="text-center">{dayjs(text).format('HH:mm')}</span>,
          },
          {
            title: '内容',
            dataIndex: 'title',
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

export default FocusList;
