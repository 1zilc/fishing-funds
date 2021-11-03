import React from 'react';
import classnemes from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from '@/reducers/types';
import { setTabActiveKeyAction } from '@/actions/tabs';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface TabsBarProps {}
export interface Tab {
  key: Enums.TabKeyType;
  name: string;
}
const tabs = [
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
];
const TabsBar: React.FC<TabsBarProps> = () => {
  const dispatch = useDispatch();
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

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
