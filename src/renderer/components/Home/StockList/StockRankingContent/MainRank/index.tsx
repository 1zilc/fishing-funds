import React, { PropsWithChildren, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Divider } from 'antd';
import { useRequest } from 'ahooks';
import clsx from 'clsx';

import CustomDrawer from '@/components/CustomDrawer';
import TypeSelection from '@/components/TypeSelection';
import { useDrawer } from '@/utils/hooks';
import { StoreState } from '@/reducers/types';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const DetailStockContent = React.lazy(() => import('@/components/Home/StockList/DetailStockContent'));
const AddStockContent = React.lazy(() => import('@/components/Home/StockList/AddStockContent'));

interface MainRankProps {}

const dayTypeList = [
  { name: '今日', type: '1', code: 'f184' },
  { name: '5日', type: '5', code: 'f165' },
  { name: '10日', type: '10', code: 'f176' },
];

const RenderColorCol = ({ value }: { value: string }) => {
  return <div className={Utils.GetValueColor(value).textClass}>{value}%</div>;
};

const MainRank: React.FC<PropsWithChildren<MainRankProps>> = () => {
  const [dayType, setDayType] = useState(dayTypeList[0]);
  const [data, setData] = useState([]);
  const { codeMap, stockConfig } = useSelector((state: StoreState) => state.stock.config);

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
      title: `日涨跌`,
      dataIndex: 'zdf',
      render: (text: string) => <div className={Utils.GetValueColor(text).textClass}>{text}%</div>,
      sorter: (a: any, b: any) => a.zdf - b.zdf,
    },
    {
      title: `主力净占比`,
      dataIndex: 'zljzb',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => a.zljzb - b.zljzb,
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

  const { loading } = useRequest(() => Services.Stock.GetMainRankFromEastmoney(dayType.code), {
    onSuccess: setData,
    refreshDeps: [dayType.code],
  });

  return (
    <div className={styles.content}>
      <TypeSelection types={dayTypeList} activeType={dayType.type} onSelected={setDayType} style={{ marginTop: 10, marginBottom: 10 }} />
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
export default MainRank;
