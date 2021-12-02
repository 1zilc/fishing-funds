import React, { PropsWithChildren, ReactNode, useRef } from 'react';
import html2canvas from 'html2canvas';
import classnames from 'classnames';
import DownloadIcon from '@/static/icon/download.svg';
import CopyIcon from '@/static/icon/copy.svg';
import RefreshIcon from '@/static/icon/refresh.svg';

import styles from './index.module.scss';

export interface ChartCardProps {
  className?: string;
  onClick?: any;
  onDoubleClick?: any;
  auto?: boolean;
  onFresh?: () => void;
  TitleBar?: ReactNode;
}

const { clipboard, dialog, saveImage } = window.contextModules.electron;

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
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
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
      saveImage(filePath!, dataUrl);
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
      className={classnames(styles.content, className, {
        [styles.autoSize]: auto,
      })}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      ref={chartRef}
    >
      <div className={styles.toolbar}>
        {TitleBar && <div style={{ flex: 1 }}>{TitleBar}</div>}
        {onFresh && <RefreshIcon onClick={onFresh} />}
        <DownloadIcon onClick={downLoadChartToLocal} />
        <CopyIcon onClick={writeChartToClipboard} />
      </div>
      {children}
    </aside>
  );
};
export default ChartCard;
