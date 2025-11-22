import React, { PropsWithChildren } from 'react';

import { Table } from 'antd';
import { useRequest } from 'ahooks';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer, useAppSelector } from '@/utils/hooks';

import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

const DetailStockContent = React.lazy(() => import('@/components/Home/StockView/DetailStockContent'));
const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));

interface StockRankProps {
  fsCode: string;
}

const StockRank: React.FC<PropsWithChildren<StockRankProps>> = (props) => {
  const codeMap = useAppSelector((state) => state.wallet.stockConfigCodeMap);
  const { data: detailSecid, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');
  const { data: addName, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: `涨跌`,
      dataIndex: 'zdf',
      render: (text: string) => <div className={Utils.GetValueColor(text).textClass}>{text}%</div>,
      sorter: (a: any, b: any) => a.zdf - b.zdf,
    },
    {
      title: '操作',
      render: (text: string, record: any) => {
        return !codeMap[record.secid] ? (
          <a
            onClick={(e) => {
              setAddDrawer(record.name);
              e.stopPropagation();
            }}
          >
            自选
          </a>
        ) : (
          <div>已添加</div>
        );
      },
    },
  ];

  const { data = [], loading } = useRequest(() => Services.Stock.GetStockRank(props.fsCode), {
    cacheKey: Utils.GenerateRequestKey('Services.Stock.GetStockRank', props.fsCode),
  });

  return (
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
          placement: ['bottomCenter'],
        }}
        onRow={(record) => ({
          onClick: () => setDetailDrawer(record.secid),
        })}
      />
      <CustomDrawer show={showDetailDrawer}>
        <DetailStockContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} secid={detailSecid} />
      </CustomDrawer>
      <CustomDrawer show={showAddDrawer}>
        <AddStockContent defaultName={addName} onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
    </div>
  );
};
export default StockRank;
