import React, { PropsWithChildren, useState, useEffect } from 'react';
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

interface TodayProps {}

const fundTypeList = [
  { name: '全部', type: 1, code: '1' },
  { name: '股票', type: 2, code: '2' },
  { name: '混合', type: 3, code: '3' },
  { name: '债券', type: 4, code: '4' },
  { name: '指数', type: 5, code: '5' },
  { name: 'QDII', type: 6, code: '6' },
  { name: 'ETF', type: 7, code: '7' },
  { name: 'LOF', type: 8, code: '8' },
  { name: '场内', type: 9, code: '9' },
];

const RenderColorCol = ({ value }: { value: string }) => {
  const text = value.substring(0, value.length - 1);
  return <div className={Utils.GetValueColor(text).textClass}>{value}</div>;
};

const Today: React.FC<PropsWithChildren<TodayProps>> = () => {
  const [fundType, setFundType] = useState(fundTypeList[0]);
  const [data, setData] = useState([]);
  const { currentWalletFundsCodeMap: codeMap } = useCurrentWallet();
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');
  const { data: addCode, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'jjjc',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '净值',
      dataIndex: 'dwjz',
      sorter: (a: any, b: any) => Number(a.dwjz) - Number(b.dwjz),
    },
    {
      title: '估算涨跌幅',
      dataIndex: 'gszzl',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => {
        const a1 = a.gszzl.substring(0, a.gszzl.length - 1);
        const b1 = b.gszzl.substring(0, b.gszzl.length - 1);
        return Number(a1) - Number(b1);
      },
    },
    {
      title: '操作',
      render: (text: string, record: any) => {
        return !codeMap[record.bzdm] ? (
          <a
            onClick={(e) => {
              setAddDrawer(record.bzdm);
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

  const { run: runGetTodayListFromEastmoney, loading } = useRequest(() => Services.Fund.GetTodayListFromEastmoney(fundType.type), {
    onSuccess: setData,
    refreshDeps: [fundType.type],
  });

  return (
    <ChartCard auto onFresh={runGetTodayListFromEastmoney}>
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
            onClick: () => setDetailDrawer(record.bzdm),
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
export default Today;
