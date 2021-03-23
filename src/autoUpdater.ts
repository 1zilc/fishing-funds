import { NativeImage, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export default class AppUpdater {
  constructor(conf: { icon?: NativeImage; win?: BrowserWindow }) {
    autoUpdater.autoDownload = false;
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    // autoUpdater.checkForUpdatesAndNotify();
    try {
      autoUpdater.setFeedURL('https://ff-releases.1zilc.top');
      autoUpdater.checkForUpdates();
    } catch {
      console.log('检查更新失败');
    }
    // autoUpdater.currentVersion = '2.0.0';

    autoUpdater.on('error', (error) => {
      // dialog.showErrorBox(
      //   'Error: ',
      //   error == null ? 'unknown' : (error.stack || error).toString()
      // );
    });

    //检查事件
    autoUpdater.on('checking-for-update', () => {
      // sendUpdateMessage(returnData.checking);
      log.info('returnData.checking');
    });

    //当前版本为最新版本
    autoUpdater.on('update-not-available', () => {
      // setTimeout(() => {
      //   dialog.showMessageBox({
      //     icon,
      //     type: 'info',
      //     title: `无可用更新`,
      //     message: `当前为最新版本！`,
      //   });
      // }, 1000);
    });

    //更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      // win.webContents.send('downloadProgress', progressObj);
      log.info('正在下载', progressObj);
    });

    //发现新版本
    autoUpdater.on('update-available', (data) => {
      conf.win?.webContents.send('update-available', data);
      // dialog
      //   .showMessageBox({
      //     icon,
      //     type: 'info',
      //     title: `发现新版本 v${version}`,
      //     message: `找到更新 v${version}，您现在要更新吗？`,
      //     detail: releaseNote,
      //     buttons: ['确定', '取消'],
      //   })
      //   .then(({ response }) => {
      //     if (response === 0) {
      //       console.info('开始下载更新');
      //       autoUpdater.downloadUpdate();
      //     } else {
      //       console.info('取消更新');
      //     }
      //   });
    });

    // 下载完毕
    autoUpdater.on('update-downloaded', () => {
      // dialog
      //   .showMessageBox({
      //     title: '安装更新',
      //     message: '已下载更新，应用程序将退出以进行更新...',
      //     buttons: ['确定'],
      //   })
      //   .then(() => {
      //     setImmediate(() => autoUpdater.quitAndInstall());
      //   });
    });
  }
}
