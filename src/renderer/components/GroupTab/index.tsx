import { Suspense } from 'react';
import { useCreation, useMemoizedFn } from 'ahooks';
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

interface GroupTabProps extends TabsProps {
  tabKey: Enums.TabKeyType;
}

const GroupTab = (props: GroupTabProps) => {
  const { tabKey } = props;
  const dispatch = useAppDispatch();
  const activeKey = useAppSelector((state) => state.tabs.tabsKeyMap[tabKey]);

  const items = useCreation(
    () =>
      props.items?.map((item) => {
        item.children = <Suspense fallback={<Empty text="加载中..." />}>{item.children}</Suspense>;
        return item;
      }),
    [props.items]
  );

  const onTagChange = useMemoizedFn((e: string) =>
    dispatch(syncTabsKeyMapAction({ key: tabKey, activeKey: Number(e) }))
  );

  return (
    <Tabs
      size="small"
      activeKey={String(activeKey)}
      animated={{ tabPane: true, inkBar: true }}
      tabBarGutter={15}
      tabBarStyle={groupBarStyle}
      destroyInactiveTabPane
      items={items}
      onChange={onTagChange}
    />
  );
};

export default GroupTab;
