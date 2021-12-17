import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import { useDrawer, useCurrentWallet } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface FundsProps {
  code: string;
}

const RenderColorCol = ({ value }: { value: string }) => {
  return <div className={Utils.GetValueColor(value).textClass}>{value}%</div>;
};

const Funds: React.FC<PropsWithChildren<FundsProps>> = ({ code }) => {
  const [data, setData] = useState([]);
  const { currentWalletFundsCodeMap: codeMap } = useCurrentWallet();
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');
  const { data: addCode, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'SHORTNAME',
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '1周',
      dataIndex: 'SYL_Z',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => Number(a.SYL_Z) - Number(b.SYL_Z),
    },
    {
      title: '1月',
      dataIndex: 'SYL_Y',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => Number(a.SYL_Y) - Number(b.SYL_Y),
    },
    {
      title: '1年',
      dataIndex: 'SYL_1N',
      render: (text: string) => <RenderColorCol value={text} />,
      sorter: (a: any, b: any) => Number(a.SYL_1N) - Number(b.SYL_1N),
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

  const { run: runGetFundsFromEasymoney, loading } = useRequest(() => Services.Quotation.GetFundsFromEastmoney(code), {
    onSuccess: setData,
    refreshDeps: [code],
  });

  return (
    <ChartCard auto onFresh={runGetFundsFromEasymoney}>
      <div className={styles.content}>
        <Table
          rowKey="FCODE"
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
            onClick: () => setDetailDrawer(record.FCODE),
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
export default Funds;
