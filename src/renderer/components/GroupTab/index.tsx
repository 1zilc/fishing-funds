import React, { PropsWithChildren } from 'react';
import { Tabs } from 'antd';

import { setTabskeyMapAction } from '@/actions/tabs';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';

export interface GroupTapProps {
  tabKey: Enums.TabKeyType;
}
const GroupTap: React.FC<PropsWithChildren<GroupTapProps>> = (props) => {
  const { tabKey } = props;
  const dispatch = useAppDispatch();
  const defaultActiveKey = useAppSelector((state) => state.tabs.tabsKeyMap[tabKey]);

  const groupBarStyle = {
    background: 'var(--background-color)',
    borderBottom: `1px solid var(--border-color)`,
    margin: 0,
    paddingLeft: 25,
  };

  return (
    <Tabs
      size="small"
      defaultActiveKey={String(defaultActiveKey)}
      animated={{ tabPane: true, inkBar: true }}
      tabBarGutter={15}
      tabBarStyle={groupBarStyle}
      destroyInactiveTabPane
      onChange={(e) => dispatch(setTabskeyMapAction(tabKey, Number(e)))}
    >
      {props.children}
    </Tabs>
  );
};
export default GroupTap;
