import React, { PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import styles from './index.module.css';

interface ExchangeListProps {
  onView: (url: string) => void;
}

const ExchangeList: React.FC<PropsWithChildren<ExchangeListProps>> = (props) => {
  const {
    data = [],
    loading,
    run: runNewsGetExchangeList,
  } = useRequest(Services.News.GetExchangeList, {
    cacheKey: Utils.GenerateRequestKey('News.GetExchangeList'),
    staleTime: CONST.DEFAULT.NEWS_STALE_DELAY,
  });

  return (
    <ChartCard auto onFresh={runNewsGetExchangeList}>
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
            onClick: () => props.onView(record.url_unique),
          })}
        />
      </div>
    </ChartCard>
  );
};

export default ExchangeList;
