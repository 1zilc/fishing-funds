import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import CustomDrawer from '@/components/CustomDrawer';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import { useDrawer, useCurrentWallet } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

interface RantingProps {}

const Ranting: React.FC<PropsWithChildren<RantingProps>> = () => {
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
      title: '上证',
      dataIndex: 'szStar',
      render: (text: string) => <span className="text-center">{text}</span>,
      sorter: (a: any, b: any) => Number(a.szStar) - Number(b.szStar),
    },
    {
      title: '招商',
      dataIndex: 'zsStar',
      render: (text: string) => <span className="text-center">{text}</span>,
      sorter: (a: any, b: any) => Number(a.zsStar) - Number(b.zsStar),
    },
    {
      title: '济安',
      dataIndex: 'jaStar',
      render: (text: string) => <span className="text-center">{text}</span>,
      sorter: (a: any, b: any) => Number(a.jaStar) - Number(b.jaStar),
    },
    {
      title: '总',
      dataIndex: 'total',
      render: (text: string) => <span className="text-center">{text}🌟</span>,
      sorter: (a: any, b: any) => Number(a.total) - Number(b.total),
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

  const { loading } = useRequest(Services.Fund.GetFundRatingFromEasemoney, {
    throwOnError: true,
    onSuccess: setData,
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
  );
};
export default Ranting;
