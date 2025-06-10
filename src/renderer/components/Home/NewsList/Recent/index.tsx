import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import { useOpenWebView } from '@/utils/hooks';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';

interface RecentProps {
  keyword: string;
  filter?: Enums.NewsFilterType;
}

const Recent: React.FC<RecentProps> = (props) => {
  const { keyword, filter } = props;

  const [pageIndex, setPageIndex] = useState(1);
  const {
    data = { total: 0, list: [] },
    loading,
    run: runNewsGetBondList,
  } = useRequest(() => Services.News.GetRecent(keyword, pageIndex, filter), {
    debounceWait: 1000,
    debounceLeading: true,
    debounceTrailing: true,
    refreshDeps: [keyword, pageIndex],
    ready: !!keyword,
  });

  const openWebView = useOpenWebView({ title: '资讯详情', phone: true });

  return (
    <ChartCard auto onFresh={runNewsGetBondList}>
      <div className={styles.content}>
        <Table<typeof data.list>
          rowKey="code"
          size="small"
          columns={[
            {
              title: '时间',
              dataIndex: 'date',
              width: 60,
              render: (text: string) => <span className="text-center">{dayjs(text).format('MM-DD')}</span>,
            },
            {
              title: '内容',
              dataIndex: 'content',
              ellipsis: true,
              render: (text: string) => <a className={styles.title} dangerouslySetInnerHTML={{ __html: text }}></a>,
            },
          ]}
          dataSource={data.list}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
            total: data.total,
            onChange(page) {
              setPageIndex(page);
            },
          }}
          onRow={(record) => ({
            onClick: () => openWebView(record.url),
          })}
        />
      </div>
    </ChartCard>
  );
};

export default Recent;
