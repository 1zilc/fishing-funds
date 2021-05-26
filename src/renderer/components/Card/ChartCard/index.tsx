import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';
import styles from './index.scss';

export interface ChartCardProps {
  className?: string;
  onClick?: any;
  onDoubleClick?: any;
  auto?: boolean;
}

export const ChartCard: React.FC<PropsWithChildren<ChartCardProps>> = ({
  onClick,
  onDoubleClick,
  className = {},
  children,
  auto,
}) => {
  return (
    <aside
      className={classnames(styles.content, className, {
        [styles.autoSize]: auto,
      })}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </aside>
  );
};
export default ChartCard;
