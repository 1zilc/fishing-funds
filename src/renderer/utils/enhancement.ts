/**
 *  该文件对window.contextModules的模块进行二次封装
 */
import * as Enums from '@/utils/enums';

const { invoke } = window.contextModules.electron;
const { version, production } = window.contextModules.process;
const { encodeFF, decodeFF } = window.contextModules.io;
const electronStore = window.contextModules.electronStore;
const log = window.contextModules.log;

export async function UpdateSystemTheme(setting: Enums.SystemThemeType) {
  await invoke.setNativeThemeSource(setting);
}

export async function GenerateBackupConfig() {
  const config = await electronStore.all();
  const fileConfig: Backup.Config = {
    name: 'Fishing-Funds-Backup',
    author: '1zilc',
    website: 'https://ff.1zilc.top',
    github: 'https://github.com/1zilc/fishing-funds',
    version: version,
    content: encodeFF(config),
    timestamp: Date.now(),
    suffix: 'ff',
  };
  return fileConfig;
}

export function CheckEnvTool() {
  if (production) {
    Object.assign(console, log.functions);
  }
}

export async function CoverBackupConfig(fileConfig: Backup.Config) {
  const content = decodeFF(fileConfig.content);
  return CoverStorage(content);
}

export async function GetStorage<T = any>(key: string, init: T): Promise<T> {
  return electronStore.get(key, init);
}

export async function SetStorage(key: string, data: any) {
  return electronStore.set(key, data);
}

export async function CoverStorage(data: any) {
  return electronStore.cover(data);
}

export async function ClearStorage(key: string) {
  return electronStore.delete(key);
}
