import React, { PropsWithChildren, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Divider } from 'antd';
import { useRequest } from 'ahooks';
import classnames from 'classnames';

import CustomDrawer from '@/components/CustomDrawer';
import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import AddStockContent from '@/components/Home/StockList/AddStockContent';
import TypeSelection from '@/components/TypeSelection';
import { useDrawer } from '@/utils/hooks';
import { StoreState } from '@/reducers/types';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface SelfRankProps {}

const dayTypeList = [
  { name: '今日', type: '1', code: 'f62' },
  { name: '3日', type: '3', code: 'f267' },
  { name: '5日', type: '5', code: 'f164' },
  { name: '10日', type: '10', code: 'f174' },
];

const RenderColorCol = ({ value }: { value: string }) => {
  return <div className={Utils.GetValueColor(value).textClass}>{value}亿</div>;
};

const SelfRank: React.FC<PropsWithChildren<SelfRankProps>> = () => {
  const [dayType, setDayType] = useState(dayTypeList[0]);
  const [data, setData] = useState([]);
  const { codeMap } = useSelector((state: StoreState) => state.stock.config);

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
      title: `主力流入`,
      dataIndex: 'zllr',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => a.zllr - b.zllr,
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

  const { run: runGetSelfRankFromEastmoney, loading } = useRequest(() => Services.Stock.GetSelfRankFromEastmoney(dayType.code), {
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
export default SelfRank;
