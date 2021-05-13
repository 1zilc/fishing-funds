import { NativeImage, BrowserWindow, dialog, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export default class AppUpdater {
  process = '';
  constructor(conf: { icon?: NativeImage; win?: BrowserWindow }) {
    autoUpdater.autoDownload = false;
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.setFeedURL('https://ff-releases.1zilc.top');
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
      switch (this.process) {
        case 'mainer':
          dialog.showMessageBox({
            icon: conf.icon,
            type: 'info',
            title: `无可用更新`,
            message: `当前为最新版本！`,
          });
          break;
        case 'renderer':
          break;
      }
    });

    //更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      // win.webContents.send('downloadProgress', progressObj);
      log.info('正在下载', progressObj);
    });

    //发现新版本
    autoUpdater.on('update-available', (data) => {
      switch (this.process) {
        case 'mainer':
          dialog
            .showMessageBox({
              icon: conf.icon,
              type: 'info',
              title: `发现新版本 v${data.version}`,
              message: `找到更新 v${data.version}，您现在要更新吗？`,
              detail: data.releaseNote,
              buttons: ['前往下载', '取消'],
            })
            .then(({ response }) => {
              if (response === 0) {
                console.info('下载更新');
                shell.openExternal('https://ff.1zilc.top#download');
              } else {
                console.info('取消更新');
              }
            });
          break;
        case 'renderer':
          conf.win?.webContents.send('update-available', data);
          break;
      }
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

  public checkUpdate(process: 'mainer' | 'renderer') {
    this.process = process;

    try {
      // autoUpdater.currentVersion = '1.2.0';
      autoUpdater.checkForUpdates();
    } catch {
      console.log('检查更新失败');
    }
  }
}
