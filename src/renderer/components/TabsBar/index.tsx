import React, { useEffect } from 'react';
import clsx from 'clsx';

import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface TabsBarProps {}
export interface Tab {
  key: Enums.TabKeyType;
  name: string;
}

const TabsBar: React.FC<TabsBarProps> = () => {
  const dispatch = useAppDispatch();
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);
  const bottomTabsSetting = useAppSelector((state) => state.setting.systemSetting.bottomTabsSetting);

  useEffect(() => {
    const validKeys = bottomTabsSetting.filter(({ show }) => show).map(({ key }) => key);
    const isActiveKeyValid = validKeys.includes(tabsActiveKey);
    if (!isActiveKeyValid) {
      dispatch(syncTabsActiveKeyAction(validKeys[0]));
    }
  }, [tabsActiveKey, bottomTabsSetting]);

  return (
    <div className={styles.layout}>
      <div className={clsx(styles.content, 'max-content')}>
        {bottomTabsSetting
          .filter(({ show }) => show)
          .map((tab) => (
            <React.Fragment key={tab.key}>
              <div
                className={clsx(styles.tab, {
                  [styles.active]: tabsActiveKey === tab.key,
                })}
                onClick={() => dispatch(syncTabsActiveKeyAction(tab.key))}
              >
                {tab.name}
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};
export default TabsBar;
