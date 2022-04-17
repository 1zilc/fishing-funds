import React, { PropsWithChildren, useState } from 'react';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useRequest } from 'ahooks';
import ChartCard from '@/components/Card/ChartCard';
import * as Services from '@/services';
import styles from './index.module.scss';

interface MettingProps {
  code: string;
}

const today = dayjs();

const Metting: React.FC<PropsWithChildren<MettingProps>> = (props) => {
  const { code } = props;
  const [data, setData] = useState<any[]>([]);

  const { loading, run: runStockGetMeetingData } = useRequest(
    () =>
      Services.Stock.GetMeetingData({
        code,
        startTime: today.format('YYYY-MM-DD'),
        endTime: today.add(1, 'month').format('YYYY-MM-DD'),
      }),
    {
      onSuccess: setData,
    }
  );

  return (
    <ChartCard auto onFresh={runStockGetMeetingData}>
      <div className={styles.content}>
        <Table
          rowKey="id"
          size="small"
          columns={[
            {
              title: '时间',
              dataIndex: 'START_DATE',
              width: 100,
              render: (text: string, record) => {
                const isSingle = record.START_DATE === record.END_DATE;
                return (
                  <span className="text-center">
                    {isSingle
                      ? dayjs(record.START_DATE).format('MM-DD')
                      : `${dayjs(record.START_DATE).format('MM-DD')} 至 ${dayjs(record.END_DATE).format('MM-DD')}`}
                  </span>
                );
              },
            },
            {
              title: '内容',
              dataIndex: 'FE_NAME',
              ellipsis: true,
            },
          ]}
          dataSource={data}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </ChartCard>
  );
};

export default Metting;
