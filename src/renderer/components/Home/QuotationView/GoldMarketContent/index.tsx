import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import GoldTrends from '@/components/Home/QuotationView/GoldMarketContent/GoldTrends';
import K from '@/components/Home/QuotationView/GoldMarketContent/K';
import InternationalMetalFutures from '@/components/Home/QuotationView/GoldMarketContent/InternationalMetalFutures';
import InternationalMetalGoods from '@/components/Home/QuotationView/GoldMarketContent/InternationalMetalGoods';
import ShanghaiGoldFutures from '@/components/Home/QuotationView/GoldMarketContent/ShanghaiGoldFutures';
import ShanghaiGoldGoods from '@/components/Home/QuotationView/GoldMarketContent/ShanghaiGoldGoods';
import styles from './index.module.scss';

interface GoldMarketContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const GoldMarketContent: React.FC<GoldMarketContentProps> = (props) => {
  return (
    <CustomDrawerContent title="黄金市场" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '黄金期货',
                children: <GoldTrends secid="113.aum" title="沪金主力" />,
              },
              {
                key: String(1),
                label: '国际金价',
                children: <GoldTrends secid="101.GC00Y" title="COMEX黄金" />,
              },
              {
                key: String(2),
                label: '金价K线',
                children: <K />,
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '国际贵金属期货',
                children: <InternationalMetalFutures />,
              },
              {
                key: String(1),
                label: '国际贵金属现货',
                children: <InternationalMetalGoods />,
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '上海黄金期货',
                children: <ShanghaiGoldFutures />,
              },
              {
                key: String(1),
                label: '上海黄金现货',
                children: <ShanghaiGoldGoods />,
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default GoldMarketContent;
