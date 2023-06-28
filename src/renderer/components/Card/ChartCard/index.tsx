import React, { PropsWithChildren, ReactNode, useRef } from 'react';
import { Tooltip } from 'antd';
import { useBoolean } from 'ahooks';
import clsx from 'clsx';
import { RiRefreshLine, RiArrowDownSLine, RiArrowUpSLine, RiQuestionLine } from 'react-icons/ri';
import Collapse from '@/components/Collapse';
import styles from './index.module.scss';

export interface ChartCardProps {
  className?: string;
  onClick?: any;
  onDoubleClick?: any;
  auto?: boolean;
  onFresh?: () => void;
  TitleBar?: ReactNode;
  pureContent?: boolean;
  showCollapse?: boolean;
  describe?: string;
}

const { clipboard, dialog } = window.contextModules.electron;
const { saveImage } = window.contextModules.io;

const size = {
  heigh: 12,
  width: 12,
};

export const ChartCard: React.FC<PropsWithChildren<ChartCardProps>> = ({
  onFresh,
  onClick,
  onDoubleClick,
  className = {},
  children,
  auto,
  TitleBar,
  pureContent,
  showCollapse,
  describe,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const [isOpened, { setTrue, setFalse }] = useBoolean(true);

  return (
    <aside
      className={clsx(styles.content, className, {
        [styles.autoSize]: auto,
      })}
      style={{
        minHeight: !showCollapse && !auto ? 200 : 'initial',
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      ref={chartRef}
    >
      <div className={styles.toolbar}>
        {TitleBar && <div style={{ flex: 1 }}>{TitleBar}</div>}
        {onFresh && <RiRefreshLine onClick={onFresh} />}
        {showCollapse && (isOpened ? <RiArrowUpSLine onClick={setFalse} /> : <RiArrowDownSLine onClick={setTrue} />)}
        {describe && (
          <Tooltip placement="bottomRight" title={describe} overlayClassName={styles.describe} color={'var(--primary-color)'}>
            <RiQuestionLine />
          </Tooltip>
        )}
      </div>
      <div
        className={clsx([
          styles.body,
          {
            [styles.pure]: pureContent,
          },
        ])}
      >
        {showCollapse ? <Collapse isOpened={isOpened}>{children}</Collapse> : children}
      </div>
    </aside>
  );
};
export default ChartCard;
