import React, { PropsWithChildren, useState } from 'react';
import { Drawer } from 'antd';

export interface CustomDrawerProps {
  show: boolean;
}
const CustomDrawer: React.FC<PropsWithChildren<CustomDrawerProps>> = ({
  show,
  children,
  ...config
}) => {
  const [drawerOpened, setDrawerOpened] = useState(show);
  return (
    <Drawer
      visible={show}
      maskClosable
      closable={false}
      handler={false}
      placement="bottom"
      height="100vh"
      afterVisibleChange={setDrawerOpened}
      bodyStyle={{ padding: 0 }}
      push={false}
      {...config}
    >
      {(show || drawerOpened) && children}
    </Drawer>
  );
};

export default CustomDrawer;
