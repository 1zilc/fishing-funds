import { Tray } from 'electron';
import { trayIcon } from './icon';

export function createTray() {
  const tray = new Tray(trayIcon);
  return tray;
}
