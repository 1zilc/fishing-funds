import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import { useDrawer, useCurrentWallet } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

interface WarehouseEventProps {
  code: string;
}

const WarehouseEvent: React.FC<PropsWithChildren<WarehouseEventProps>> = ({ code }) => {
  const [data, setData] = useState<any[]>([]);
  const [date, setDate] = useState('');
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'GPJC',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '行业',
      dataIndex: 'INDEXNAME',
    },
    {
      title: '占比',
      dataIndex: 'JZBL',
      render: (text: string) => <span>{text}%</span>,
    },
    {
      title: '操作',
      dataIndex: 'PCTNVCHG',
      render: (text: string, record: any) => (
        <span className={Utils.GetValueColor(text).textClass}>{`${record.PCTNVCHGTYPE} ${text}%`}</span>
      ),
    },
  ];

  const { run: runGetFundRatingFromEasemoney, loading } = useRequest(() => Services.Fund.GetIndustryRateFromEaseMoney(code), {
    throwOnError: true,
    onSuccess: ({ stocks, expansion }) => {
      setData(stocks);
      setDate(expansion);
    },
  });

  return (
    <ChartCard auto onFresh={runGetFundRatingFromEasemoney} TitleBar={<div className={styles.date}>{date}</div>}>
      <div className={styles.content}>
        <Table
          rowKey="GPDM"
          size="small"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            defaultPageSize: 20,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
          onRow={(record) => ({
            onClick: () => setDetailDrawer(record.code),
          })}
        />
        <CustomDrawer show={showDetailDrawer}>
          <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCode} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};
export default WarehouseEvent;
