import React, { PropsWithChildren } from 'react';

import { Table } from 'antd';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer, useAppSelector } from '@/utils/hooks';

import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

const DetailCoinContent = React.lazy(() => import('@/components/Home/CoinView/DetailCoinContent'));
const AddCoinContent = React.lazy(() => import('@/components/Home/CoinView/AddCoinContent'));

interface MainRankProps {}

const RenderColorCol = ({ value }: { value: string }) => {
  return <div className={Utils.GetValueColor(value).textClass}>{value}</div>;
};

const MainRank: React.FC<PropsWithChildren<MainRankProps>> = () => {
  const { codeMap } = useAppSelector((state) => state.coin.config);
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');
  const { data: addName, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'symbol',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: `24H涨跌`,
      dataIndex: 'changePercent24Hr',
      render: (text: string) => <div className={Utils.GetValueColor(text).textClass}>{text}%</div>,
      sorter: (a: any, b: any) => a.changePercent24Hr - b.changePercent24Hr,
    },
    {
      title: `价格$`,
      dataIndex: 'priceUsd',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => a.priceUsd - b.priceUsd,
    },
    {
      title: '操作',
      render: (text: string, record: any) => {
        return !codeMap[record.code] ? (
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

  const { data = [], run: runCoinFromCoinCap, loading } = useRequest(() => Services.Coin.FromCoinCap('', ''));

  return (
    <ChartCard auto onFresh={runCoinFromCoinCap}>
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
          onRow={(record) => ({
            onClick: () => setDetailDrawer(record.code),
          })}
        />
        <CustomDrawer show={showDetailDrawer}>
          <DetailCoinContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCode} />
        </CustomDrawer>
        <CustomDrawer show={showAddDrawer}>
          <AddCoinContent defaultName={addName} onClose={closeAddDrawer} onEnter={closeAddDrawer} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};
export default MainRank;
