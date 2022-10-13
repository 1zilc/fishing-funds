import React, { PropsWithChildren } from 'react';
import { Button } from 'antd';
import { useKeyPress } from 'ahooks';
import Collect from '@/components/Collect';
import styles from './index.module.scss';

export interface CustomDrawerContentProps {
  onEnter: () => void;
  onClose: () => void;
  title: string;
  closeText?: string;
  enterText?: string;
}

const CustomDrawer: React.FC<PropsWithChildren<CustomDrawerContentProps>> = ({
  onEnter,
  onClose,
  title,
  closeText,
  enterText,
  children,
}) => {
  useKeyPress(['Escape'], (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'Enter':
      default:
        // onEnter();
        break;
    }
  });

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Button type="text" onClick={onClose}>
          {closeText || '关闭'}
        </Button>
        <h3>{title}</h3>
        <Button type="primary" onClick={onEnter}>
          {enterText || '确定'}
        </Button>
      </div>
      <div className={styles.body}>{children}</div>
      <Collect title={title} />
    </div>
  );
};

export default CustomDrawer;
