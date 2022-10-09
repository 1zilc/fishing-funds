import { nativeImage } from 'electron';
import { getAssetPath } from './util';

export const appIcon = nativeImage.createFromPath(getAssetPath('icon.png'));
export const trayIcon = nativeImage.createFromPath(getAssetPath('menu/iconTemplate.png'));

export function generateIconFromPath(path: string) {
  return nativeImage.createFromPath(getAssetPath(path)).resize({ height: 18, width: 18 });
}

export function generateIconFromDataURL(dataURL: string) {
  return nativeImage.createFromDataURL(dataURL).resize({ height: 18, width: 18 });
}
