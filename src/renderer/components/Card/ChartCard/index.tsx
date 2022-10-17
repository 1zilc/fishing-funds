import React, { PropsWithChildren, ReactNode, useRef } from 'react';
import { Tooltip } from 'antd';
import html2canvas from 'html2canvas';
import { useBoolean } from 'ahooks';
import clsx from 'clsx';
import DownloadIcon from '@/static/icon/download.svg';
import CopyIcon from '@/static/icon/copy.svg';
import RefreshIcon from '@/static/icon/refresh.svg';
import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import Collapse from '@/components/Collapse';
import QuestionIcon from '@/static/icon/question.svg';
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
  async function writeChartToClipboard() {
    try {
      const canvas = await html2canvas(chartRef.current!);
      const dataUrl = canvas.toDataURL();
      clipboard.writeImage(dataUrl);
      dialog.showMessageBox({
        title: '复制成功',
        type: 'info',
        message: `图片已复制到粘贴板`,
      });
    } catch (error) {
      dialog.showMessageBox({
        title: '复制出错',
        type: 'error',
        message: `图片复制出现错误`,
      });
    }
  }

  async function downLoadChartToLocal() {
    try {
      const canvas = await html2canvas(chartRef.current!);
      const dataUrl = canvas.toDataURL();
      const now = Date.now();
      const { filePath, canceled } = await dialog.showSaveDialog({ title: '保存', defaultPath: `Fishing-Funds-Snapshot-${now}.png` });
      if (canceled) {
        return;
      }
      await saveImage(filePath!, dataUrl);
      dialog.showMessageBox({
        title: '保存成功',
        type: 'info',
        message: `图片已保存`,
      });
    } catch (error) {
      dialog.showMessageBox({
        title: '保存出错',
        type: 'error',
        message: `图片保存出现错误`,
      });
    }
  }

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
        {onFresh && <RefreshIcon onClick={onFresh} />}
        <DownloadIcon onClick={downLoadChartToLocal} />
        <CopyIcon onClick={writeChartToClipboard} />
        {showCollapse && (isOpened ? <ArrowUpIcon onClick={setFalse} /> : <ArrowDownIcon onClick={setTrue} />)}
        {describe && (
          <Tooltip placement="bottomRight" title={describe} overlayClassName={styles.describe} color={'var(--primary-color)'}>
            <QuestionIcon />
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
