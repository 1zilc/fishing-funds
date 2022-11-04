import { globalShortcut, dialog } from 'electron';
import { Menubar } from 'menubar';

export type OnHotkeyTriggerParams = {
  /**
   * 当前当前menubar显示状态
   */
  visible: boolean;
};
export interface OnHotkeyTrigger {
  (params: OnHotkeyTriggerParams): void;
}
export default class HotkeyManager {
  private activeHotkeys = '';

  public mb: Menubar;

  constructor(config: { mb: Menubar }) {
    this.mb = config.mb;
  }

  get visible() {
    return !!this.mb.window?.isVisible();
  }

  registryHotkey(keys: string, callback: OnHotkeyTrigger) {
    if (keys === this.activeHotkeys) {
      return;
    }
    if (this.activeHotkeys) {
      globalShortcut.unregister(this.activeHotkeys.split(' + ').join('+'));
    }
    if (keys) {
      const accelerator = keys.split(' + ').join('+');
      const res = globalShortcut.register(accelerator, () => {
        callback({
          visible: this.visible,
        });
      });
      if (res) {
        // dialog.showMessageBox({ message: `${accelerator}快捷键设置成功`, type: 'info' });
      } else {
        const isRegistered = globalShortcut.isRegistered(accelerator);
        if (isRegistered) {
          dialog.showMessageBox({ message: `${accelerator}快捷键已被占用`, type: 'warning' });
        } else {
          dialog.showMessageBox({ message: `${accelerator}快捷键设置失败`, type: 'error' });
        }
      }
    }
    this.activeHotkeys = keys;
  }
}
