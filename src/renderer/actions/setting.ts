import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';

export const SYNC_SETTING = 'SYNC_SETTING';

export const defalutSystemSetting: System.Setting = {
  fundApiTypeSetting: Enums.FundApiType.Eastmoney,

  conciseSetting: false,
  lowKeySetting: false,
  baseFontSizeSetting: 12,
  systemThemeSetting: Enums.SystemThemeType.Auto,

  autoStartSetting: true,
  adjustmentNotificationSetting: false,
  autoFreshSetting: true,
  freshDelaySetting: 1,
  autoCheckUpdateSetting: true,
};

const { app } = window.contextModules.electron;

export function getSystemSetting() {
  const systemSetting: System.Setting = Utils.GetStorage(
    CONST.STORAGE.SYSTEM_SETTING,
    defalutSystemSetting
  );
  return { ...defalutSystemSetting, ...systemSetting };
}

export function setSystemSetting(setting: System.Setting) {
  const systemSetting = getSystemSetting();
  Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, {
    ...systemSetting,
    ...setting,
  });
  return asyncSetting();
}

export function asyncSetting() {
  const systemSetting = getSystemSetting();
  return {
    type: SYNC_SETTING,
    payload: systemSetting,
  };
}
