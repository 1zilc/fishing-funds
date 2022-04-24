import React from 'react';
import classnemes from 'clsx';

import { setTabActiveKeyAction } from '@/actions/tabs';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface TabsBarProps {}
export interface Tab {
  key: Enums.TabKeyType;
  name: string;
}
export const tabs = [
  {
    key: Enums.TabKeyType.Funds,
    name: '基金',
  },
  {
    key: Enums.TabKeyType.Zindex,
    name: '指数',
  },
  {
    key: Enums.TabKeyType.Quotation,
    name: '板块',
  },
  {
    key: Enums.TabKeyType.Stock,
    name: '股票',
  },
  {
    key: Enums.TabKeyType.Coin,
    name: '货币',
  },
  // {
  //   key: Enums.TabKeyType.News,
  //   name: '资讯',
  // },
];
const TabsBar: React.FC<TabsBarProps> = () => {
  const dispatch = useAppDispatch();
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {tabs.map((tab) => (
          <React.Fragment key={tab.key}>
            <div
              className={classnemes(styles.tab, {
                [styles.active]: tabsActiveKey === tab.key,
              })}
              onClick={() => dispatch(setTabActiveKeyAction(tab.key))}
            >
              {tab.name}
            </div>
            <i />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default TabsBar;
