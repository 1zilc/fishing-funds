import React, { PropsWithChildren, useState } from 'react';
import { Table, Divider } from 'antd';
import { useRequest } from 'ahooks';
import classnames from 'classnames';

import CustomDrawer from '@/components/CustomDrawer';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

interface AutomaticProps {}

const RenderColorCol = ({ value }: { value: string }) => {
  const text = value.substring(0, value.length - 1);
  return <div className={Utils.GetValueColor(text).textClass}>{value}</div>;
};
const Automatic: React.FC<PropsWithChildren<AutomaticProps>> = () => {
  const {
    data: detailCode,
    show: showDetailDrawer,
    set: setDetailDrawer,
    close: closeDetailDrawer,
  } = useDrawer('');

  const {
    data: addCode,
    show: showAddDrawer,
    set: setAddDrawer,
    close: closeAddDrawer,
  } = useDrawer('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      with: '40%',
      ellipsis: true,
    },
    {
      title: '1年',
      dataIndex: 'y1',
      render: (text: string) => <RenderColorCol value={text} />,
    },
    {
      title: '3年',
      dataIndex: 'y3',
      render: (text: string) => <RenderColorCol value={text} />,
    },
    {
      title: '5年',
      dataIndex: 'y5',
      render: (text: string) => <RenderColorCol value={text} />,
    },
    {
      title: '操作',
      render: (text: string, record: any) => {
        return (
          <>
            <a
              style={{ marginRight: 2 }}
              onClick={() => setDetailDrawer(record.code)}
            >
              详情
            </a>
            <a onClick={() => setAddDrawer(record.code)}>自选</a>
          </>
        );
      },
    },
  ];
  const [data, setData] = useState([]);

  const { loading } = useRequest(Services.Fund.GetAutomaticPlanFromEastMoney, {
    cacheKey: `GetAutomaticPlanFromEastMoney`,
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
      />
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent
          onEnter={closeDetailDrawer}
          onClose={closeDetailDrawer}
          code={detailCode}
        />
      </CustomDrawer>
      <CustomDrawer show={showAddDrawer}>
        <AddFundContent
          defaultCode={addCode}
          onClose={closeAddDrawer}
          onEnter={closeAddDrawer}
        />
      </CustomDrawer>
    </div>
  );
};
export default Automatic;
