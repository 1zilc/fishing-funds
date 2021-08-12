import React, { PropsWithChildren, useRef } from 'react';
import html2canvas from 'html2canvas';
import classnames from 'classnames';
import { ReactComponent as DownloadIcon } from '@/assets/icons/download.svg';
import { ReactComponent as CopyIcon } from '@/assets/icons/copy.svg';

import styles from './index.scss';

export interface ChartCardProps {
  className?: string;
  onClick?: any;
  onDoubleClick?: any;
  auto?: boolean;
}

const { clipboard, dialog, saveImage } = window.contextModules.electron;

const size = {
  heigh: 12,
  width: 12,
};

export const ChartCard: React.FC<PropsWithChildren<ChartCardProps>> = ({ onClick, onDoubleClick, className = {}, children, auto }) => {
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
      console.log('图片复制错误', error);
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
      console.log('图片保存错误', error);
    }
  }
  return (
    <aside
      className={classnames(styles.content, className, {
        [styles.autoSize]: auto,
      })}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={styles.toolbar}>
        <DownloadIcon onClick={downLoadChartToLocal} />
        <CopyIcon onClick={writeChartToClipboard} />
      </div>
      <div ref={chartRef}>{children}</div>
    </aside>
  );
};
export default ChartCard;
