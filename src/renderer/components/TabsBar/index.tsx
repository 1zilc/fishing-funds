import React, { useRef } from 'react';
import classnemes from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from '@/reducers/types';
import { setTabActiveKey } from '@/actions/tabs';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface TabsBarProps {
  onChange?: (key: Enums.TabKeyType, tab: Tab) => void;
}
export interface Tab {
  key: Enums.TabKeyType;
  name: string;
}
const tabs = [
  {
    key: Enums.TabKeyType.Funds,
    name: '基金自选',
  },
  {
    key: Enums.TabKeyType.Zindex,
    name: '指数行情',
  },
  {
    key: Enums.TabKeyType.Quotation,
    name: '板块行情',
  },
];
const TabsBar: React.FC<TabsBarProps> = ({ onChange }) => {
  const dispatch = useDispatch();

  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {tabs.map((tab) => (
          <React.Fragment key={tab.key}>
            <div
              className={classnemes(styles.tab, {
                [styles.active]: tabsActiveKey === tab.key,
              })}
              onClick={() => {
                dispatch(setTabActiveKey(tab.key));
                onChange && onChange(tab.key, tab);
              }}
            >
              {tab.name}
            </div>
            <i></i>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default TabsBar;
