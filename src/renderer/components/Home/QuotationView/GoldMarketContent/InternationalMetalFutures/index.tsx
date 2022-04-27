import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const DetailFundContent = React.lazy(() => import('@/components/Home/FundView/DetailFundContent'));

interface InternationalMetalFuturesProps {}

const RenderColorCol = ({ value }: { value: string }) => {
  return <div className={Utils.GetValueColor(value).textClass}>{value}%</div>;
};

const InternationalMetalFutures: React.FC<PropsWithChildren<InternationalMetalFuturesProps>> = () => {
  const [data, setData] = useState<any[]>([]);
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '最新价',
      dataIndex: 'zxj',
      sorter: (a: any, b: any) => Number(a.zxj) - Number(b.zxj),
    },
    {
      title: '涨跌幅',
      dataIndex: 'zdf',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => Number(a.zxj) - Number(b.zxj),
    },
  ];

  const { run: runGetInternationalMetalFuturesFromEastmoney, loading } = useRequest(
    () => Services.Quotation.GetInternationalMetalFuturesFromEastmoney(),
    {
      onSuccess: setData,
    }
  );

  return (
    <ChartCard auto onFresh={runGetInternationalMetalFuturesFromEastmoney}>
      <div className={styles.content}>
        <Table
          rowKey="code"
          size="small"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            defaultPageSize: 20,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
          // onRow={(record) => ({
          //   onClick: () => setDetailDrawer(record.bzdm),
          // })}
        />
        <CustomDrawer show={showDetailDrawer}>
          <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCode} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};
export default InternationalMetalFutures;
