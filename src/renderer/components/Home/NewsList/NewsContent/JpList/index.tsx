import React, { PropsWithChildren, useState } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@/services';
import styles from './index.module.scss';

interface JpListProps {
  onView: (url: string) => void;
}

const JpList: React.FC<PropsWithChildren<JpListProps>> = (props) => {
  const [data, setData] = useState<News.ResponseItem[]>([]);

  const { loading, run: runNewsGetJpList } = useRequest(Services.News.GetJpList, {
    onSuccess: setData,
  });

  return (
    <ChartCard auto onFresh={runNewsGetJpList}>
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
            defaultPageSize: 10,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
          onRow={(record) => ({
            onClick: () => props.onView(record.url_m),
          })}
        />
      </div>
    </ChartCard>
  );
};

export default JpList;
