import React, { PropsWithChildren, useState, Suspense } from 'react';
import { Drawer } from 'antd';
import SkeletonContent from '@/components/CustomDrawer/SkeletonContent';
import * as CONST from '@/constants';

export interface CustomDrawerProps {
  show: boolean;
  [index: string]: any;
  cached?: boolean;
  className?: string;
}
const CustomDrawer: React.FC<PropsWithChildren<CustomDrawerProps>> = ({ show, children, cached, className, ...config }) => {
  const [drawerOpened, setDrawerOpened] = useState(show);

  return (
    <Drawer
      className={className}
      open={show}
      closable={false}
      placement="bottom"
      height="100%"
      width="100%"
      keyboard={false}
      afterOpenChange={setDrawerOpened}
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
