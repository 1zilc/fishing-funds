import NP from 'number-precision';
import request from 'request';
import * as Utils from '../utils';
import CONST_STORAGE from '../constants/storage.json';

const { remote } = require('electron');
const { app } = remote;

export const getSystemSetting: () => System.Setting = () => {
  const { openAtLogin: autoStartSetting } = app.getLoginItemSettings();
  const systemSetting = Utils.GetStorage(CONST_STORAGE.SYSTEM_SETTING, {
    autoStartSetting,
    autoFreshSetting: true,
    freshDelaySetting: 1
  });
  return systemSetting;
};

export const setSystemSetting: (setting: System.Setting) => void = setting => {
  const systemSetting = getSystemSetting();
  Utils.SetStorage(CONST_STORAGE.SYSTEM_SETTING, {
    ...systemSetting,
    ...setting
  });
};
