import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

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

export function GetSystemSetting() {
  const systemSetting: System.Setting = Utils.GetStorage(CONST.STORAGE.SYSTEM_SETTING, defalutSystemSetting);
  return { ...defalutSystemSetting, ...systemSetting };
}
