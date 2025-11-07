import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer, useAppSelector } from '@/utils/hooks';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

const AddFundContent = React.lazy(() => import('@/components/Home/FundView/AddFundContent'));
const DetailFundContent = React.lazy(() => import('@/components/Home/FundView/DetailFundContent'));
interface HoldFundsProps {
  secid: string;
}

const HoldFunds: React.FC<PropsWithChildren<HoldFundsProps>> = ({ secid }) => {
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const [dateIndex, setDateIndex] = useState(0);
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');
  const { data: addCode, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'HOLDER_NAME',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '总股数(万)',
      dataIndex: 'TOTAL_SHARES',
      render: (text: number) => <div>{(text / 10 ** 4).toFixed(2)}</div>,
      sorter: (a: any, b: any) => Number(a.TOTAL_SHARES) - Number(b.TOTAL_SHARES),
    },
    {
      title: '总市值(亿)',
      dataIndex: 'HOLD_MARKET_CAP',
      render: (text: number) => <div>{(text / 10 ** 8).toFixed(2)}</div>,
      sorter: (a: any, b: any) => Number(a.HOLD_MARKET_CAP) - Number(b.HOLD_MARKET_CAP),
    },
    {
      title: '操作',
      render: (text: string, record: any) => {
        return !codeMap[record.HOLDER_CODE] ? (
          <a
            onClick={(e) => {
              setAddDrawer(record.HOLDER_CODE);
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

  const { data: date = [], loading: dateLoading } = useRequest(Services.Stock.GetReportDate);

  const {
    data = [],
    run: runStockGetStockHoldFunds,
    loading,
  } = useRequest(() => Services.Stock.GetStockHoldFunds(secid, date[dateIndex]), {
    refreshDeps: [dateIndex],
    ready: !!date[dateIndex],
  });

  useEffect(() => {
    if (!data.length) {
      setDateIndex(1);
    }
  }, [data]);

  return (
    <ChartCard auto onFresh={runStockGetStockHoldFunds} TitleBar={<div className={styles.titleBar}>{date[dateIndex]}</div>}>
      <div className={styles.content}>
        <Table
          rowKey="HOLDER_CODE"
          size="small"
          columns={columns}
          dataSource={data}
          loading={loading || dateLoading}
          pagination={{
            defaultPageSize: 20,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
          onRow={(record) => ({
            onClick: () => setDetailDrawer(record.HOLDER_CODE),
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
export default HoldFunds;
