import dayjs from 'dayjs';
import { store } from '@/.';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export const defalutSystemSetting: System.Setting = {
  fundApiTypeSetting: Enums.FundApiType.Eastmoney,

  conciseSetting: false,
  lowKeySetting: false,
  baseFontSizeSetting: 12,
  systemThemeSetting: Enums.SystemThemeType.Auto,

  adjustmentNotificationSetting: true,
  adjustmentNotificationTimeSetting: dayjs().hour(14).minute(30).format(),
  riskNotificationSetting: true,
  trayContentSetting: [Enums.TrayContent.Sy],

  coinUnitSetting: Enums.CoinUnitType.Usd,

  httpProxySetting: false,
  httpProxyWhitelistSetting: false,
  httpProxyAddressSetting: 'http://127.0.0.1:1087',
  httpProxyRuleSetting: 'api.coingecko.com,api.coincap.io',

  autoStartSetting: true,
  autoFreshSetting: true,
  freshDelaySetting: 1,
  autoCheckUpdateSetting: true,
  timestampSetting: Enums.TimestampType.Network,
};

export function GetSystemSetting() {
  const {
    setting: { systemSetting },
  } = store.getState();
  return systemSetting;
}
