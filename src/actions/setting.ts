import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';

const remote = require('electron').remote;
const app = remote.app;

export function getSystemSetting() {
  const { openAtLogin: autoStartSetting } = app.getLoginItemSettings();
  const systemSetting: System.Setting = Utils.GetStorage(
    CONST.STORAGE.SYSTEM_SETTING,
    {
      conciseSetting: false,
      lowKeySetting: false,
      autoStartSetting,
      autoFreshSetting: true,
      freshDelaySetting: 1,
      autoCheckUpdateSetting: true,
      baseFontSizeSetting: 12,
    }
  );
  return systemSetting;
}

export function setSystemSetting(setting: System.Setting) {
  const systemSetting = getSystemSetting();
  Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, {
    ...systemSetting,
    ...setting,
  });
}

export function getFundApiTypeSetting() {
  return Utils.GetStorage(
    CONST.STORAGE.FUND_API_TYPE,
    Enums.FundApiType.Eastmoney
  ) as Enums.FundApiType;
}

export function setFundApiTypeSetting(fundApiType: Enums.FundApiType) {
  Utils.SetStorage(CONST.STORAGE.FUND_API_TYPE, fundApiType);
}
