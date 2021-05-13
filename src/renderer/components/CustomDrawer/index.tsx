import React, { PropsWithChildren, useState } from 'react';
import Drawer from 'rc-drawer';
import { IDrawerProps } from 'rc-drawer/lib/IDrawerPropTypes.d';

export interface CustomDrawerProps extends IDrawerProps {
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
      open={show}
      showMask
      maskClosable
      level={null}
      handler={false}
      placement="bottom"
      height="100vh"
      {...config}
      afterVisibleChange={setDrawerOpened}
    >
      {(show || drawerOpened) && children}
    </Drawer>
  );
};

export default CustomDrawer;
