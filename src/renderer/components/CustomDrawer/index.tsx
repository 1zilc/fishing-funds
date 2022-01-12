import React, { PropsWithChildren, useState } from 'react';
import { Drawer } from 'antd';

export interface CustomDrawerProps {
  show: boolean;
  [index: string]: any;
  cached?: boolean;
}
const CustomDrawer: React.FC<PropsWithChildren<CustomDrawerProps>> = ({ show, children, cached, ...config }) => {
  const [drawerOpened, setDrawerOpened] = useState(show);
  return (
    <Drawer
      visible={show}
      closable={false}
      handler={false}
      placement="bottom"
      height="100vh"
      width="100%"
      keyboard={false}
      afterVisibleChange={setDrawerOpened}
      bodyStyle={{ padding: 0 }}
      push={false}
      {...config}
    >
      {(cached || show || drawerOpened) && children}
    </Drawer>
  );
};

export default CustomDrawer;
