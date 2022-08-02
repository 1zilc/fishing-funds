import React, { PropsWithChildren, Suspense } from 'react';
import { Tabs, TabPaneProps } from 'antd';
import Empty from '@/components/Empty';
import { syncTabsKeyMapAction } from '@/store/features/tabs';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';

export interface GroupTapProps {
  tabKey: Enums.TabKeyType;
}

interface GroupTapType extends React.FC<PropsWithChildren<GroupTapProps>> {
  TabPane: React.FC<PropsWithChildren<TabPaneProps>>;
}

const groupBarStyle = {
  background: 'var(--background-color)',
  borderBottom: `1px solid var(--border-color)`,
  margin: 0,
  paddingLeft: 25,
};

const GroupTap: GroupTapType = (props) => {
  const { tabKey } = props;
  const dispatch = useAppDispatch();
  const defaultActiveKey = useAppSelector((state) => state.tabs.tabsKeyMap[tabKey]);

  return (
    <Tabs
      size="small"
      defaultActiveKey={String(defaultActiveKey)}
      animated={{ tabPane: true, inkBar: true }}
      tabBarGutter={15}
      tabBarStyle={groupBarStyle}
      destroyInactiveTabPane
      onChange={(e) => dispatch(syncTabsKeyMapAction({ key: tabKey, activeKey: Number(e) }))}
    >
      {props.children}
    </Tabs>
  );
};

GroupTap.TabPane = (props) => {
  return (
    <Tabs.TabPane {...props}>
      <Suspense fallback={<Empty text="加载中..." />}>{props.children}</Suspense>
    </Tabs.TabPane>
  );
};

export default GroupTap;
