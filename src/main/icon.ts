import { nativeImage } from 'electron';
import { getAssetPath } from './util';

export const appIcon = nativeImage.createFromPath(getAssetPath('icon.png'));
export const trayIcon = nativeImage.createFromPath(getAssetPath('menu/iconTemplate.png'));

export function generateWalletIcon(iconIndex: number) {
  return nativeImage.createFromPath(getAssetPath(`wallet/${iconIndex}.png`)).resize({ height: 18, width: 18 });
}
