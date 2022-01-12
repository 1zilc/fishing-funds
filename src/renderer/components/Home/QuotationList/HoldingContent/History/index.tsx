import React, { PropsWithChildren, useState } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';

import CustomDrawer from '@/components/CustomDrawer';
import DetailQuotationContent from '@/components/Home/QuotationList/DetailQuotationContent';
import AddStockContent from '@/components/Home/StockList/AddStockContent';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface NorthHistoryProps {
  marketCode: string;
  reportName: string;
}

const { shell } = window.contextModules.electron;

const NorthHistory: React.FC<PropsWithChildren<NorthHistoryProps>> = (props) => {
  const { marketCode, reportName } = props;
  const [data, setData] = useState<any[]>([]);
  const {
    data: quodationCode,
    show: showDetailQuodationDrawer,
    set: setDetailQuodationDrawer,
    close: closeDetailQuodationDrawer,
  } = useDrawer('');

  const { data: stockName, show: showAddStockDrawer, set: setAddStockDrawer, close: closeAddStockDrawer } = useDrawer('');

  const { loading } = useRequest(Services.Quotation.GetHodingFromEastmoney, {
    defaultParams: [marketCode, reportName],

    onSuccess: setData,
  });

  return (
    <div className={styles.content}>
      <Table
        rowKey="HOLD_DATE"
        size="small"
        columns={[
          {
            title: '时间',
            width: 80,
            dataIndex: 'HOLD_DATE',
            render: (text: string) => <span className="text-center">{dayjs(text).format('YYYY-MM-DD')}</span>,
          },

          {
            title: '增持市值',
            dataIndex: 'ADD_MARKET_CAP',
            ellipsis: true,
            render: (text: string) => <span className={Utils.GetValueColor(text).textClass}>{text}亿</span>,
          },
          {
            title: '增持占比',
            dataIndex: 'ADD_MARKET_RATE',
            ellipsis: true,
            render: (text: number) => <span className={Utils.GetValueColor(text).textClass}>{text}‰</span>,
          },
          {
            title: '市值增持',
            dataIndex: 'ADD_MARKET_BNAME',
            ellipsis: true,
            render: (text: string, record) => <a onClick={() => setDetailQuodationDrawer(record.ADD_MARKET_NEWBCODE)}>{text}</a>,
          },
          {
            title: '占比增持',
            dataIndex: 'BOARD_RATE_BNAME',
            ellipsis: true,
            render: (text: string, record) => <a onClick={() => setDetailQuodationDrawer(record.BOARD_RATE_NEWBCODE)}>{text}</a>,
          },

          {
            title: '市值增持',
            dataIndex: 'ADD_MARKET_MNAME',
            ellipsis: true,
            render: (text: string, record) => <a onClick={() => setAddStockDrawer(record.ADD_MARKET_MNAME)}>{text}</a>,
          },
          {
            title: '股数增持',
            dataIndex: 'ADD_SHARES_MNAME',
            ellipsis: true,
            render: (text: string, record) => <a onClick={() => setAddStockDrawer(record.ADD_SHARES_MNAME)}>{text}</a>,
          },
          {
            title: '占比增持',
            dataIndex: 'MARKET_RATE_MNAME',
            ellipsis: true,
            render: (text: string, record) => <a onClick={() => setAddStockDrawer(record.MARKET_RATE_MNAME)}>{text}</a>,
          },
        ]}
        dataSource={data}
        loading={loading}
        pagination={{
          defaultPageSize: 20,
          hideOnSinglePage: true,
          position: ['bottomCenter'],
        }}
      />
      <CustomDrawer show={showDetailQuodationDrawer}>
        <DetailQuotationContent onEnter={closeDetailQuodationDrawer} onClose={closeDetailQuodationDrawer} code={quodationCode} />
      </CustomDrawer>
      <CustomDrawer show={showAddStockDrawer}>
        <AddStockContent onEnter={closeAddStockDrawer} onClose={closeAddStockDrawer} defaultName={stockName} />
      </CustomDrawer>
    </div>
  );
};

export default NorthHistory;
