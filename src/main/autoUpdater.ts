import { NativeImage, dialog, shell, app } from 'electron';
import path from 'path';
import { Menubar } from 'menubar';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { sendMessageToRenderer } from './util';

export default class AppUpdater {
  process = '';

  constructor(conf: { icon?: NativeImage; mb: Menubar }) {
    autoUpdater.autoDownload = false;
    log.transports.file.level = 'info';
    // Object.defineProperty(app, 'isPackaged', {
    //   get() {
    //     return true;
    //   },
    // });
    // autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml');
    // (autoUpdater as any).currentVersion = '1.0.0';
    autoUpdater.logger = log;
    // autoUpdater.setFeedURL('https://download.1zilc.top');
    autoUpdater.on('error', (error) => {});

    // 检查事件
    autoUpdater.on('checking-for-update', () => {
      // sendUpdateMessage(returnData.checking);
      log.info('returnData.checking');
    });

    // 当前版本为最新版本
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
        default:
          break;
      }
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      // win.webContents.send('downloadProgress', progressObj);
      log.info('正在下载', progressObj);
    });

    // 发现新版本
    autoUpdater.on('update-available', (data) => {
      switch (this.process) {
        case 'mainer':
          dialog
            .showMessageBox({
              icon: conf.icon,
              type: 'info',
              title: `发现新版本 v${data.version}`,
              message: `您现在要更新 v${data.version} 吗？`,
              buttons: ['前往下载', '取消'],
            })
            .then(({ response }) => {
              if (response === 0) {
                console.info('下载更新');
                shell.openExternal('https://ff.1zilc.top#download');
              } else {
                console.info('取消更新');
              }
              return null;
            })
            .catch((error) => {});
          break;
        case 'renderer':
          sendMessageToRenderer(conf.mb.window, 'update-available', data);
          break;
        default:
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
    } catch {}
  }
}
