import React from 'react';
import { Table, Empty } from 'antd';
import clsx from 'clsx';

import PureCard from '@/components/Card/PureCard';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.css';

const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));
interface RecommendProps {
  ThemeList: {
    Code: string;
    Name: string;
    Chg: string;
    TopCode: '';
    TopName: '';
    IsImportant: '0';
    Reason: string;
    StockList: {
      Code: string;
      Name: string;
      Market: string;
      Chg: string;
    }[];
  }[];
}

const Recommend: React.FC<RecommendProps> = (props) => {
  const { ThemeList = [] } = props;
  const { data: stockName, show: showAddStockDrawer, set: setAddStockDrawer, close: closeAddStockDrawer } = useDrawer('');

  return (
    <div className={styles.content}>
      {ThemeList.length ? (
        ThemeList.map((t) => (
          <PureCard key={t.Code} className={styles.card}>
            <div className={styles.name}>
              <h3>{t.Name}</h3>
              {Number(t.Chg) > 0 ? (
                <span className={clsx(styles.tag, 'text-up', 'boder-up')}>{t.Chg}% ↗</span>
              ) : Number(t.Chg) < 0 ? (
                <span className={clsx(styles.tag, 'text-down', 'boder-down')}>{t.Chg}% ↘</span>
              ) : (
                <></>
              )}
            </div>

            <p>{t.Reason}</p>
            <div>
              <Table
                rowKey="code"
                size="small"
                columns={[
                  {
                    title: '名称',
                    dataIndex: 'Name',
                    ellipsis: true,
                    render: (text: string) => <a>{text}</a>,
                  },
                  {
                    title: '涨跌幅',
                    dataIndex: 'Chg',
                    render: (text: string) => <span className={Utils.GetValueColor(text).textClass}>{text}%</span>,
                    sorter: (a: any, b: any) => a.Chg - b.Chg,
                  },
                ]}
                dataSource={t.StockList || []}
                pagination={{
                  defaultPageSize: 5,
                  hideOnSinglePage: true,
                  position: ['bottomCenter'],
                }}
                onRow={(record) => ({
                  onClick: () => setAddStockDrawer(record.Name),
                })}
              />
            </div>
          </PureCard>
        ))
      ) : (
        <PureCard className={styles.card}>
          <Empty description="暂无相关数据~" />
        </PureCard>
      )}
      <CustomDrawer show={showAddStockDrawer}>
        <AddStockContent onEnter={closeAddStockDrawer} onClose={closeAddStockDrawer} defaultName={stockName} />
      </CustomDrawer>
    </div>
  );
};

export default Recommend;
