import React from 'react';
import clsx from 'clsx';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface ExportTitleBarProps {
  data: any[];
  name?: string;
}
const { dialog } = window.contextModules.electron;
const { saveString, saveJsonToCsv } = window.contextModules.io;
const suffix = '历史数据来自FishingFunds';

const ExportTitleBar: React.FC<ExportTitleBarProps> = (props) => {
  const { data = [], name = '' } = props;

  async function exportJson() {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: '保存',
        defaultPath: `${name}-${suffix}-${Date.now()}.json`,
      });
      if (canceled) {
        return;
      }
      await saveString(filePath!, JSON.stringify(data));
      dialog.showMessageBox({
        type: 'info',
        title: `导出成功`,
        message: `已导出${name}历史数据至${filePath}`,
      });
    } catch (error) {
      dialog.showMessageBox({
        type: 'info',
        title: `导出失败`,
        message: `导出${name}历史数据失败`,
      });
    }
  }
  async function exportCsv() {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: '保存',
        defaultPath: `${name}-${suffix}-${Date.now()}.csv`,
      });
      if (canceled) {
        return;
      }
      await saveJsonToCsv(filePath!, data);
      dialog.showMessageBox({
        type: 'info',
        title: `导出成功`,
        message: `已导出${name}历史数据至${filePath}`,
      });
    } catch (error) {
      dialog.showMessageBox({
        type: 'info',
        title: `导出失败`,
        message: `导出${name}历史数据失败`,
      });
    }
  }

  return (
    <div className={clsx(styles.content)}>
      <a onClick={exportJson}>导出json</a>
      <i></i>
      <a onClick={exportCsv}>导出csv</a>
    </div>
  );
};

export default ExportTitleBar;
