import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

const DetailStockContent = React.lazy(() => import('@/components/Home/StockView/DetailStockContent'));

interface WarehouseEventProps {
  stocks: any[];
}

const WarehouseEvent: React.FC<PropsWithChildren<WarehouseEventProps>> = ({ stocks }) => {
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

  return (
    <div className={styles.content}>
      <Table
        rowKey="GPDM"
        size="small"
        columns={columns}
        dataSource={stocks}
        pagination={{
          defaultPageSize: 20,
          hideOnSinglePage: true,
          position: ['bottomCenter'],
        }}
        onRow={(record) => ({
          onClick: () => setDetailDrawer(`${record.NEWTEXCH}.${record.GPDM}`),
        })}
      />
      <CustomDrawer show={showDetailDrawer}>
        <DetailStockContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} secid={detailCode} />
      </CustomDrawer>
    </div>
  );
};
export default WarehouseEvent;
