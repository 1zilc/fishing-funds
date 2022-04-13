import { nativeImage } from 'electron';
import { getAssetPath } from './util';

export const appIcon = nativeImage.createFromPath(getAssetPath('icon.png'));
export const trayIcon = nativeImage.createFromPath(getAssetPath('menu/iconTemplate.png'));

export function generateWalletIcon(iconIndex: number) {
  return generateIcon(`wallet/${iconIndex}.png`);
}
export function generateIcon(path: string) {
  return nativeImage.createFromPath(getAssetPath(path)).resize({ height: 18, width: 18 });
}
