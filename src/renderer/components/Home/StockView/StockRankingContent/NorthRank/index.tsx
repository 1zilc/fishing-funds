import React, { PropsWithChildren, useState, useEffect } from 'react';

import { Table } from 'antd';
import { useRequest } from 'ahooks';

import CustomDrawer from '@/components/CustomDrawer';
import TypeSelection from '@/components/TypeSelection';
import ColorfulTags from '@/components/ColorfulTags';
import { useDrawer, useAppSelector } from '@/utils/hooks';

import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));

interface NorthRankProps {}

const dayTypeList = [
  { name: '今日', type: '1', code: '1' },
  { name: '3日', type: '3', code: '3' },
  { name: '5日', type: '5', code: '5' },
  { name: '10日', type: '10', code: '10' },
  { name: '季度', type: 'Q', code: 'Q' },
  { name: '1年', type: 'Y', code: 'Y' },
];

const NorthRank: React.FC<PropsWithChildren<NorthRankProps>> = () => {
  const [dayType, setDayType] = useState(dayTypeList[0]);
  const { data: addName, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'SECURITY_NAME',
      ellipsis: true,
      render: (text: string, record: any) => <a>{text}</a>,
    },
    {
      title: `日涨跌`,
      dataIndex: 'CHANGE_RATE',
      render: (text: string) => <div className={Utils.GetValueColor(text).textClass}>{text}%</div>,
      sorter: (a: any, b: any) => a.CHANGE_RATE - b.CHANGE_RATE,
    },
    {
      title: `市值增持`,
      dataIndex: 'ADD_MARKET_CAP',
      render: (text: string) => <div>{text}亿</div>,
      sorter: (a: any, b: any) => a.ADD_MARKET_CAP - b.ADD_MARKET_CAP,
    },
    {
      title: `板块`,
      dataIndex: 'INDUSTRY_NAME',
      render: (text: string) => (
        <div className={styles.tag}>
          <ColorfulTags tags={[text]} />
        </div>
      ),
    },
  ];

  const { data = [], loading } = useRequest(() => Services.Stock.GetNorthRankFromEastmoney(dayType.code), {
    refreshDeps: [dayType.code],
    cacheKey: Utils.GenerateRequestKey('Stock.GetNorthRankFromEastmoney', dayType.code),
  });

  return (
    <div className={styles.content}>
      <TypeSelection
        types={dayTypeList}
        activeType={dayType.type}
        onSelected={setDayType}
        style={{ marginTop: 10, marginBottom: 10 }}
      />
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
          onClick: () => setAddDrawer(record.SECURITY_NAME),
        })}
      />
      <CustomDrawer show={showAddDrawer}>
        <AddStockContent defaultName={addName} onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
    </div>
  );
};
export default NorthRank;
