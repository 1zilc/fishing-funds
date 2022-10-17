/**
 *  该文件对window.contextModules的模块进行二次封装
 */
import * as Enums from '@/utils/enums';
const { ipcRenderer } = window.contextModules.electron;
const { version } = window.contextModules.process;
const { saveString, readFile } = window.contextModules.io;
const { encodeFF, decodeFF, encryptFF, decryptFF } = window.contextModules.coding;
const electronStore = window.contextModules.electronStore;

export async function UpdateSystemTheme(setting: Enums.SystemThemeType) {
  await ipcRenderer.invoke('set-native-theme-source', setting);
}

export async function GenerateBackupConfig() {
  const config = await electronStore.all('config');
  const fileConfig: Backup.Config = {
    name: 'Fishing-Funds-Backup',
    author: '1zilc',
    website: 'https://ff.1zilc.top',
    github: 'https://github.com/1zilc/fishing-funds',
    version: version,
    content: await encodeFF(config),
    timestamp: Date.now(),
    suffix: 'ff',
  };
  return fileConfig;
}

export async function GenerateSyncConfig(config: { [x: string]: any }) {
  const fileConfig: Backup.Config = {
    name: 'Fishing-Funds-Sync',
    author: '1zilc',
    website: 'https://ff.1zilc.top',
    github: 'https://github.com/1zilc/fishing-funds',
    version: version,
    content: await encodeFF(config),
    timestamp: Date.now(),
    suffix: 'ff',
  };
  return fileConfig;
}

export async function CoverBackupConfig(fileConfig: Backup.Config) {
  const content = await decodeFF(fileConfig.content);
  return electronStore.cover('config', content);
}

export async function SaveSyncConfig(path: string, config: Backup.Config) {
  const encodeSyncConfig = await encryptFF(config);
  await saveString(path, encodeSyncConfig);
}

export async function loadSyncConfig(path: string) {
  const encodeSyncConfig = await readFile(path);
  const syncConfig: Backup.Config = await decryptFF(encodeSyncConfig);
  const content = await decodeFF(syncConfig.content);
  return content;
}
