import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';
import styles from './index.scss';

export interface PureCardProps {
  className?: string;
  onClick?: any;
  onDoubleClick?: any;
}

export const PureCard: React.FC<PropsWithChildren<PureCardProps>> = ({
  onClick,
  onDoubleClick,
  className = {},
  children,
}) => {
  return (
    <aside
      className={classnames(styles.content, className)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </aside>
  );
};
export default PureCard;
