import React, { PropsWithChildren } from 'react';
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
        <button className={styles.close} onClick={onClose}>
          {closeText || '关闭'}
        </button>
        <h3>{title}</h3>
        <button className={styles.add} onClick={onEnter}>
          {enterText || '确定'}
        </button>
      </div>
      <div className={styles.body}>{children}</div>
      <Collect title={title} />
    </div>
  );
};

export default CustomDrawer;
