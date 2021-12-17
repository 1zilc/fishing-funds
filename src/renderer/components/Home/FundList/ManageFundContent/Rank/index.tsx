import React, { PropsWithChildren, useState } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import TypeSelection from '@/components/TypeSelection';
import { useDrawer, useCurrentWallet } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface RankProps {}

const fundTypeList = [
  { name: '全部', type: 'all', code: 'all' },
  { name: '股票', type: 'gp', code: 'gp' },
  { name: '混合', type: 'hh', code: 'hh' },
  { name: '债券', type: 'zq', code: 'zq' },
  { name: '指数', type: 'zs', code: 'zs' },
  { name: 'QDII', type: 'qdii', code: 'qdii' },
  { name: 'LOF', type: 'lof', code: 'lof' },
  { name: 'FOF', type: 'fof', code: 'fof' },
];

const RenderColorCol = ({ value }: { value: string }) => {
  return <div className={Utils.GetValueColor(value).textClass}>{value}%</div>;
};

const Rank: React.FC<PropsWithChildren<RankProps>> = () => {
  const [fundType, setFundType] = useState(fundTypeList[0]);
  const [data, setData] = useState([]);
  const { currentWalletFundsCodeMap: codeMap } = useCurrentWallet();
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const { data: addCode, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '1日',
      dataIndex: 'd',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => a.d - b.d,
    },
    {
      title: '1周',
      dataIndex: 'w',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => a.w - b.w,
    },
    {
      title: '1月',
      dataIndex: 'm',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => a.m - b.m,
    },
    {
      title: '操作',
      render: (text: string, record: any) => {
        return !codeMap[record.code] ? (
          <a
            onClick={(e) => {
              setAddDrawer(record.code);
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

  const { run: runGetRankDataFromEasemoney, loading } = useRequest(() => Services.Fund.GetRankDataFromEasemoney(fundType.type), {
    onSuccess: (result) => {
      setData(
        result.map((_: string) => {
          const [code, name, jx, date, dwjz, ljjz, d, w, m] = _.split(',');
          return {
            code,
            name,
            d,
            w,
            m,
          };
        })
      );
    },
    refreshDeps: [fundType.type],
  });

  return (
    <ChartCard auto onFresh={runGetRankDataFromEasemoney}>
      <div className={styles.content}>
        <TypeSelection
          types={fundTypeList}
          activeType={fundType.type}
          onSelected={setFundType}
          style={{ marginTop: 10, marginBottom: 10 }}
          colspan={4}
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
            onClick: () => setDetailDrawer(record.code),
          })}
        />
        <CustomDrawer show={showDetailDrawer}>
          <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCode} />
        </CustomDrawer>
        <CustomDrawer show={showAddDrawer}>
          <AddFundContent defaultCode={addCode} onClose={closeAddDrawer} onEnter={closeAddDrawer} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};
export default Rank;
