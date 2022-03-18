import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

export interface PureCardProps {
  className?: string;
  onClick?: any;
  onDoubleClick?: any;
}

export const PureCard: React.FC<PropsWithChildren<PureCardProps>> = ({ onClick, onDoubleClick, className = {}, children }) => {
  return (
    <aside className={clsx(styles.content, className)} onClick={onClick} onDoubleClick={onDoubleClick}>
      {children}
    </aside>
  );
};
export default PureCard;
