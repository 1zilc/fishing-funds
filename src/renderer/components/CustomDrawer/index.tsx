import React, { PropsWithChildren, useState, Suspense } from 'react';
import { Drawer } from 'antd';
import SkeletonContent from '@/components/CustomDrawer/SkeletonContent';
import * as CONST from '@/constants';

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
      zIndex={CONST.DEFAULT.DRAWER_ZINDEX_DEFAULT}
      {...config}
    >
      <Suspense fallback={<SkeletonContent />}>{(cached || show || drawerOpened) && children}</Suspense>
    </Drawer>
  );
};

export default CustomDrawer;
