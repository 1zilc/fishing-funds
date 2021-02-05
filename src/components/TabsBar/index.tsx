import React, { useRef } from 'react';
import classnemes from 'classnames';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../reducers/types';
import { setTabActiveKey } from '../../actions/tabs';
import tabs, { TabsState } from '../../reducers/tabs';
import * as Enums from '../../utils/enums';
import styles from './index.scss';

export interface TabsBarProps {
  tabs: TabsState;
  onChange?: (key: Enums.TabKeyType, tab: Tab) => void;
  setTabActiveKey: (key: Enums.TabKeyType) => void;
}
export interface Tab {
  key: Enums.TabKeyType;
  name: string;
}
const TabsBar: React.FC<TabsBarProps> = ({
  onChange,
  setTabActiveKey,
  tabs,
}) => {
  const { current: memoTabs } = useRef<Tab[]>([
    {
      key: Enums.TabKeyType.Funds,
      name: '基金自选',
    },
    {
      key: Enums.TabKeyType.Zindex,
      name: '指数行情',
    },
  ]);

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {memoTabs.map((tab) => (
          <React.Fragment key={tab.key}>
            <div
              className={classnemes(styles.tab, {
                [styles.active]: tabs.activeKey === tab.key,
              })}
              onClick={() => {
                setTabActiveKey(tab.key);
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
export default connect(
  (state: StoreState) => ({
    tabs: state.tabs,
  }),
  (dispatch: Dispatch) => bindActionCreators({ setTabActiveKey }, dispatch)
)(TabsBar);
