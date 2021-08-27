import { Tray } from 'electron';
import { trayIcon } from './icon';

export function createTray() {
  const tray = new Tray(trayIcon);
  tray.setToolTip('Fishing Funds');
  return tray;
}
