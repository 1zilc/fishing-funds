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

interface AutomaticProps {}

const fundTypeList = [
  { name: '全部', type: 0, code: '0' },
  { name: '股票', type: 1, code: '1' },
  { name: '混合', type: 2, code: '2' },
  { name: '债券', type: 3, code: '3' },
  { name: '指数', type: 4, code: '4' },
  { name: 'QDII', type: 5, code: '5' },
];

const RenderColorCol = ({ value }: { value: string }) => {
  const text = value.substring(0, value.length - 1);
  return <div className={Utils.GetValueColor(text).textClass}>{value}</div>;
};

const Automatic: React.FC<PropsWithChildren<AutomaticProps>> = () => {
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
      title: '1年',
      dataIndex: 'y1',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => {
        const a1 = a.y1.substring(0, a.y1.length - 1);
        const b1 = b.y1.substring(0, b.y1.length - 1);
        return Number(a1) - Number(b1);
      },
    },
    {
      title: '3年',
      dataIndex: 'y3',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => {
        const a1 = a.y3.substring(0, a.y3.length - 1);
        const b1 = b.y3.substring(0, b.y3.length - 1);
        return Number(a1) - Number(b1);
      },
    },
    {
      title: '5年',
      dataIndex: 'y5',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => {
        const a1 = a.y5.substring(0, a.y5.length - 1);
        const b1 = b.y5.substring(0, b.y5.length - 1);
        return Number(a1) - Number(b1);
      },
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

  const { run: runGetAutomaticPlanFromEastmoney, loading } = useRequest(() => Services.Fund.GetAutomaticPlanFromEastmoney(fundType.type), {
    onSuccess: setData,
    refreshDeps: [fundType.type],
  });

  return (
    <ChartCard auto onFresh={runGetAutomaticPlanFromEastmoney}>
      <div className={styles.content}>
        <TypeSelection
          types={fundTypeList}
          activeType={fundType.type}
          onSelected={setFundType}
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
export default Automatic;
