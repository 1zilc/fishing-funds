import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import classnames from 'classnames';
import PureCard from '@/components/Card/PureCard';
import CustomDrawer from '@/components/CustomDrawer';
import AddStockContent from '@/components/Home/StockList/AddStockContent';
import Avatar from '@/components/Avatar';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import styles from './index.module.scss';

interface TodayHotProps {}

const TodayHot: React.FC<TodayHotProps> = () => {
  const [hots, setHots] = useState<
    {
      zdf: string;
      name: string;
      reason: string;
      stockName: string;
      stockCode: string;
    }[]
  >([]);
  const { data: stockName, show: showAddStockDrawer, set: setAddStockDrawer, close: closeAddStockDrawer } = useDrawer('');

  useRequest(Services.Quotation.GetTodayHotFromEastmoney, {
    onSuccess: setHots,
  });

  return (
    <div className={classnames(styles.content)}>
      {hots.map((hot) => (
        <PureCard key={hot.name}>
          <div className={styles.card}>
            <div className={styles.avatar}>
              <Avatar name={hot.name} />
            </div>
            <div>
              <div className={styles.title}>
                <h3>{hot.name}</h3>
                {Number(hot.zdf) > 0 ? (
                  <span className={classnames(styles.tag, 'text-up', 'boder-up')}>{hot.zdf}% ↗</span>
                ) : Number(hot.zdf) < 0 ? (
                  <span className={classnames(styles.tag, 'text-down', 'boder-down')}>{hot.zdf}% ↘</span>
                ) : (
                  <></>
                )}
              </div>
              <a onClick={() => setAddStockDrawer(hot.stockName)}>{hot.stockName}</a>
              <div className={styles.text}>{hot.reason}</div>
            </div>
          </div>
        </PureCard>
      ))}
      <CustomDrawer show={showAddStockDrawer}>
        <AddStockContent onEnter={closeAddStockDrawer} onClose={closeAddStockDrawer} defaultName={stockName} />
      </CustomDrawer>
    </div>
  );
};

export default TodayHot;
