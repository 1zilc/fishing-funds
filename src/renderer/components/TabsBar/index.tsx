import React, { useEffect } from 'react';

import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';
import { Segmented } from 'antd';

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
      <Segmented
        block
        size="large"
        style={{ background: 'none' }}
        styles={{ label: { fontSize: 'var(--base-font-size)' } }}
        defaultValue={tabsActiveKey}
        options={bottomTabsSetting.filter(({ show }) => show).map((item) => ({ label: item.name, value: item.key }))}
        onChange={(value) => dispatch(syncTabsActiveKeyAction(value))}
      />
    </div>
  );
};
export default TabsBar;
