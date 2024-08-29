import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Button } from 'antd';
import { useKeyPress } from 'ahooks';
import Collect from '@/components/Collect';
import styles from './index.module.scss';
import { useDrawerPopBack } from '@/utils/hooks';

export interface CustomDrawerContentProps {
  onEnter: () => void;
  onClose: () => void;
  title: string;
  closeText?: string;
  enterText?: string;
  classNames?: string;
}

const CustomDrawerContent: React.FC<PropsWithChildren<CustomDrawerContentProps>> = React.memo(
  ({ onEnter, onClose, title, closeText, enterText, children, classNames }) => {
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

    const drawerContentRef = useDrawerPopBack(onClose);

    return (
      <div className={styles.content} ref={drawerContentRef}>
        <div className={styles.header}>
          <Button type="text" onClick={onClose}>
            {closeText || '关闭'}
          </Button>
          <h3>{title}</h3>
          <Button type="primary" onClick={onEnter}>
            {enterText || '确定'}
          </Button>
        </div>
        <div className={clsx(styles.body, classNames)}>{children}</div>
        <Collect title={title} />
      </div>
    );
  }
);

export default CustomDrawerContent;
