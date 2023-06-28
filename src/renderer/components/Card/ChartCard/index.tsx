import React, { PropsWithChildren, ReactNode, useRef } from 'react';
import { Tooltip } from 'antd';
import html2canvas from 'html2canvas';
import { useBoolean } from 'ahooks';
import clsx from 'clsx';
import { RiFileCopyLine, RiDownload2Line, RiRefreshLine, RiArrowDownSLine, RiArrowUpSLine, RiQuestionLine } from 'react-icons/ri';
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
  async function writeChartToClipboard() {
    try {
      const canvas = await html2canvas(chartRef.current!);
      const dataUrl = canvas.toDataURL();
      await clipboard.writeImage(dataUrl);
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
        {onFresh && <RiRefreshLine onClick={onFresh} />}
        <RiDownload2Line onClick={downLoadChartToLocal} />
        <RiFileCopyLine onClick={writeChartToClipboard} />
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
