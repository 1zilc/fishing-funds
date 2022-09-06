import React, { PropsWithChildren, Suspense } from 'react';
import { Tabs, TabsProps } from 'antd';
import Empty from '@/components/Empty';
import { syncTabsKeyMapAction } from '@/store/features/tabs';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';

const groupBarStyle = {
  background: 'var(--background-color)',
  borderBottom: `1px solid var(--border-color)`,
  margin: 0,
  paddingLeft: 25,
};

interface GroupTapProps extends TabsProps {
  tabKey: Enums.TabKeyType;
}

// TODO: 暂时移除tabs记录，影响性能，且存储对象无实际意义
const GroupTap = (props: GroupTapProps) => {
  const { tabKey } = props;
  const dispatch = useAppDispatch();

  const items = props.items?.map((item) => {
    item.children = <Suspense fallback={<Empty text="加载中..." />}>{item.children}</Suspense>;
    return item;
  });

  return (
    <Tabs
      size="small"
      animated={{ tabPane: true, inkBar: true }}
      tabBarGutter={15}
      tabBarStyle={groupBarStyle}
      destroyInactiveTabPane
      items={items}
      // onChange={(e) => dispatch(syncTabsKeyMapAction({ key: tabKey, activeKey: Number(e) }))}
    />
  );
};

export default GroupTap;
