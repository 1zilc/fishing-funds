import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import { useOpenWebView } from '@/utils/hooks';
import * as Services from '@lib/enh/services';
import styles from './index.module.css';

interface GuBaProps {
  keyword?: string;
  type: Parameters<typeof Services.News.GetGuBaList>[1];
}

const GuBa: React.FC<GuBaProps> = (props) => {
  const { keyword } = props;

  const {
    data,
    loading,
    run: runNewsGetBondList,
  } = useRequest(() => Services.News.GetGuBaList(keyword || '', props.type), {
    debounceWait: 1000,
    debounceLeading: true,
    debounceTrailing: true,
    refreshDeps: [keyword],
    ready: !!keyword,
  });

  const openWebView = useOpenWebView({ title: '股吧', phone: true });

  return (
    <ChartCard auto onFresh={runNewsGetBondList}>
      <div className={styles.content}>
        <Table<typeof data>
          rowKey="title"
          size="small"
          columns={[
            {
              title: '时间',
              dataIndex: 'time',
              width: 90,
            },
            {
              title: '标题',
              dataIndex: 'title',
              ellipsis: true,
              render: (text: string) => <a className={styles.title}>{text}</a>,
            },
          ]}
          dataSource={data}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            hideOnSinglePage: true,
            placement: ['bottomCenter'],
            total: data?.length,
          }}
          onRow={(record) => ({
            onClick: () => openWebView(record.url),
          })}
        />
      </div>
    </ChartCard>
  );
};

export default GuBa;
