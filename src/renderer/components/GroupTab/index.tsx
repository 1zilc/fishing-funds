import React, { PropsWithChildren } from 'react';
import { Tabs } from 'antd';

import { useHomeContext } from '@/components/Home';

const GroupTap: React.FC<PropsWithChildren<Record<string, any>>> = (props) => {
  const { varibleColors } = useHomeContext();

  const groupBarStyle = {
    background: varibleColors['--background-color'],
    borderBottom: `1px solid ${varibleColors['--border-color']}`,
    margin: 0,
    paddingLeft: 25,
  };

  return (
    <Tabs size="small" animated={{ tabPane: true, inkBar: true }} tabBarGutter={15} tabBarStyle={groupBarStyle}>
      {props.children}
    </Tabs>
  );
};
export default GroupTap;
