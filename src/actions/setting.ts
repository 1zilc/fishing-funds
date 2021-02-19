import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import CONST_STORAGE from '@/constants/storage.json';

const remote = require('electron').remote;
const app = remote.app;

export function getSystemSetting() {
  const { openAtLogin: autoStartSetting } = app.getLoginItemSettings();
  const systemSetting: System.Setting = Utils.GetStorage(
    CONST_STORAGE.SYSTEM_SETTING,
    {
      conciseSetting: false,
      autoStartSetting,
      autoFreshSetting: true,
      freshDelaySetting: 1,
      autoCheckUpdateSetting: true,
    }
  );
  return systemSetting;
}

export function setSystemSetting(setting: System.Setting) {
  const systemSetting = getSystemSetting();
  Utils.SetStorage(CONST_STORAGE.SYSTEM_SETTING, {
    ...systemSetting,
    ...setting,
  });
}

export function getFundApiTypeSetting() {
  return Utils.GetStorage(
    CONST_STORAGE.FUND_API_TYPE,
    Enums.FundApiType.Eastmoney
  ) as Enums.FundApiType;
}

export function setFundApiTypeSetting(fundApiType: Enums.FundApiType) {
  Utils.SetStorage(CONST_STORAGE.FUND_API_TYPE, fundApiType);
}
