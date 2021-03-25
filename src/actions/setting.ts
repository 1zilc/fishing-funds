import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';

const defalutSystemSetting: System.Setting = {
  fundApiTypeSetting: Enums.FundApiType.Eastmoney,
  conciseSetting: false,
  lowKeySetting: false,
  autoStartSetting: false,
  autoFreshSetting: true,
  freshDelaySetting: 1,
  autoCheckUpdateSetting: true,
  baseFontSizeSetting: 12,
};

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
}
