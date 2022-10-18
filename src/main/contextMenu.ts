import { shell, Menu } from 'electron';
import { Menubar } from 'menubar';
import { generateIconFromDataURL } from './icon';
import { sendMessageToRenderer } from './util';
import AppUpdater from './autoUpdater';
import * as Enums from '../renderer/utils/enums';

export type WalletMenuConfig = {
  label: string;
  type: 'radio' | 'normal';
  dataURL: string;
  id: string;
};

export default class ContextMenuManager {
  private contextMenu: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [];

  private walletMenu: Electron.MenuItemConstructorOptions[] = [];

  private eyeMenu: Electron.MenuItemConstructorOptions = {
    click: () => {
      if (this.eyeMenu.label) {
        sendMessageToRenderer(this.win, 'change-eye-status');
      }
    },
    label: '',
  };

  private get win() {
    return this.mb.window;
  }

  public updater: AppUpdater;

  public mb: Menubar;

  constructor(option: { updater: AppUpdater; mb: Menubar }) {
    this.updater = option.updater;
    this.mb = option.mb;
    this.render();
  }

  get buildContextMenu() {
    return Menu.buildFromTemplate(this.contextMenu);
  }

  updateWalletMenu(config: WalletMenuConfig[]) {
    const menu = config.map((item) => ({
      ...item,
      icon: generateIconFromDataURL(item.dataURL),
      click: () => sendMessageToRenderer(this.win, 'change-current-wallet-code', item.id),
    }));
    this.walletMenu = menu;
    this.render();
  }

  updateEyeMenu(status: Enums.EyeStatus) {
    this.eyeMenu.label = status === Enums.EyeStatus.Open ? '隐藏收益' : '显示收益';
    this.render();
  }

  render() {
    const menu = [
      {
        role: 'about',
        label: '关于 Fishing Funds',
      },
      {
        click: () => {
          this.updater.checkUpdate('mainer');
        },
        label: '检查更新',
      },
      {
        click: () => {
          shell.openExternal('https://github.com/1zilc/fishing-funds/issues');
        },
        label: '帮助',
      },
      { type: 'separator' },
      this.eyeMenu,
      { type: 'separator' },
      {
        click: () => {
          sendMessageToRenderer(this.win, 'clipboard-funds-import');
        },
        label: '录入基金JSON配置',
      },
      {
        click: () => {
          sendMessageToRenderer(this.win, 'clipboard-funds-copy');
        },
        label: '复制基金JSON配置',
      },
      { type: 'separator' },
      {
        click: () => {
          sendMessageToRenderer(this.win, 'backup-all-config-import');
        },
        label: '导入全局配置',
      },
      {
        click: () => {
          sendMessageToRenderer(this.win, 'backup-all-config-export');
        },
        label: '导出全局配置',
      },
      { type: 'separator' },
      ...this.walletMenu,
      { type: 'separator' },
      { role: 'quit', label: '退出' },
    ] as typeof this.contextMenu;

    this.contextMenu = menu;
  }
}
