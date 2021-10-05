import React, { PropsWithChildren } from 'react';
import { Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHomeContext } from '@/components/Home';
import { StoreState } from '@/reducers/types';
import { setTabskeyMap } from '@/actions/tabs';
import * as Enums from '@/utils/enums';

export interface GroupTapProps {
  tabKey: Enums.TabKeyType;
}
const GroupTap: React.FC<PropsWithChildren<GroupTapProps>> = (props) => {
  const { tabKey } = props;
  const dispatch = useDispatch();
  const { varibleColors } = useHomeContext();
  const defaultActiveKey = useSelector((state: StoreState) => state.tabs.tabsKeyMap[tabKey]);

  const groupBarStyle = {
    background: varibleColors['--background-color'],
    borderBottom: `1px solid ${varibleColors['--border-color']}`,
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
      onChange={(e) => dispatch(setTabskeyMap(tabKey, Number(e)))}
    >
      {props.children}
    </Tabs>
  );
};
export default GroupTap;
