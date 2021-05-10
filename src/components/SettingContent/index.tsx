import React, { useState } from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { InputNumber, Radio, Badge, Switch, Slider } from 'antd';
import Logo from '@/components/Logo';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { ReactComponent as SettingIcon } from '@/assets/icons/setting.svg';
import { ReactComponent as LinkIcon } from '@/assets/icons/link.svg';
import { ReactComponent as LineCharIcon } from '@/assets/icons/line-chart.svg';
import { ReactComponent as TShirtIcon } from '@/assets/icons/t-shirt.svg';
import {
  getSystemSetting,
  setSystemSetting,
  defalutSystemSetting,
} from '@/actions/setting';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import styles from './index.scss';

const { version } = require('@/package.json');

export interface SettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const { remote, shell } = require('electron');
const { app } = remote;

const SettingContent: React.FC<SettingContentProps> = (props) => {
  const {
    fundApiTypeSetting,
    conciseSetting,
    lowKeySetting,
    baseFontSizeSetting,
    systemThemeSetting,
    autoStartSetting,
    adjustmentNotificationSetting,
    autoFreshSetting,
    freshDelaySetting,
    autoCheckUpdateSetting,
  } = getSystemSetting();

  const updateInfo = useSelector(
    (state: StoreState) => state.updater.updateInfo
  );
  const isUpdateAvaliable = !!updateInfo.version;

  // 数据来源
  const [fundapiType, setFundApiType] = useState(fundApiTypeSetting);
  // 外观设置
  const [concise, setConcise] = useState(conciseSetting);
  const [lowKey, setLowKey] = useState(lowKeySetting);
  const [baseFontSize, setBaseFontSize] = useState(baseFontSizeSetting);
  const [systemTheme, setSystemTheme] = useState(systemThemeSetting);
  // 通用设置
  const [autoStart, setAutoStart] = useState(autoStartSetting);
  const [adjustmentNotification, setAdjustmentNotification] = useState(
    adjustmentNotificationSetting
  );
  const [autoFresh, setAutoFresh] = useState(autoFreshSetting);
  const [freshDelay, setFreshDelay] = useState(freshDelaySetting);
  const [autoCheckUpdate, setAutoCheckUpdate] = useState(
    autoCheckUpdateSetting
  );

  const onSave = () => {
    setSystemSetting({
      fundApiTypeSetting: fundapiType,
      conciseSetting: concise,
      lowKeySetting: lowKey,
      baseFontSizeSetting: baseFontSize,
      systemThemeSetting: systemTheme,
      autoStartSetting: autoStart,
      adjustmentNotificationSetting: adjustmentNotification,
      autoFreshSetting: autoFresh,
      freshDelaySetting: freshDelay || defalutSystemSetting.freshDelaySetting,
      autoCheckUpdateSetting: autoCheckUpdate,
    });
    app.setLoginItemSettings({
      openAtLogin: autoStart,
    });
    Utils.UpdateSystemTheme(systemTheme);
    props.onEnter();
  };

  return (
    <CustomDrawerContent
      title="设置"
      enterText="保存"
      onClose={props.onClose}
      onEnter={onSave}
    >
      <style>{` html { font-size: ${baseFontSize}px }`}</style>
      <div className={styles.content}>
        <div
          className={classnames(styles.logo, {
            clickable: isUpdateAvaliable,
          })}
          onClick={() =>
            isUpdateAvaliable &&
            shell.openExternal('https://ff.1zilc.top/#download')
          }
        >
          <Logo />
          <Badge
            count={isUpdateAvaliable ? `v${updateInfo.version} 可更新` : 0}
            style={{ fontSize: 8 }}
            size="small"
          >
            <div className={styles.appName}>Fishing Funds v{version}</div>
          </Badge>
        </div>
        <div>
          <div className={styles.title}>
            <LineCharIcon />
            <span>数据来源</span>
          </div>
          <div className={styles.setting}>
            <Radio.Group
              value={fundapiType}
              onChange={(e) => setFundApiType(e.target.value)}
            >
              <Radio
                className={styles.radio}
                value={Enums.FundApiType.Eastmoney}
              >
                天天基金
              </Radio>
              <Radio className={styles.radio} value={Enums.FundApiType.Tencent}>
                腾讯证券
              </Radio>
              <Radio className={styles.radio} value={Enums.FundApiType.Dayfund}>
                基金速查网
              </Radio>
              <Radio className={styles.radio} value={Enums.FundApiType.Sina}>
                新浪基金
              </Radio>
              <Radio className={styles.radio} value={Enums.FundApiType.Howbuy}>
                好买基金
              </Radio>
            </Radio.Group>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <TShirtIcon />
            <span>外观设置</span>
          </div>
          <div className={styles.setting}>
            <section>
              <label>简洁模式：</label>
              <Switch size="small" checked={concise} onChange={setConcise} />
            </section>
            <section>
              <label>低调模式：</label>
              <Switch size="small" checked={lowKey} onChange={setLowKey} />
            </section>
            <section>
              <label>字体大小：</label>
              <Slider
                min={11}
                max={14}
                style={{ flex: 0.5 }}
                defaultValue={baseFontSize}
                onChange={setBaseFontSize}
                step={0.1}
              />
            </section>
            <section>
              <label>系统主题：</label>
              <Radio.Group
                optionType="button"
                size="small"
                buttonStyle="solid"
                options={[
                  { label: '亮', value: Enums.SystemThemeType.Light },
                  { label: '暗', value: Enums.SystemThemeType.Dark },
                  { label: '自动', value: Enums.SystemThemeType.Auto },
                ]}
                onChange={(e) => setSystemTheme(e.target.value)}
                value={systemTheme}
              />
            </section>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <SettingIcon />
            <span>通用设置</span>
          </div>
          <div className={styles.setting}>
            <section>
              <label>开机自启：</label>
              <Switch
                size="small"
                checked={autoStart}
                onChange={setAutoStart}
              />
            </section>
            <section>
              <label>调仓提醒：</label>
              <Switch
                size="small"
                checked={adjustmentNotification}
                onChange={setAdjustmentNotification}
              />
            </section>
            <section>
              <label>自动刷新：</label>
              <Switch
                size="small"
                checked={autoFresh}
                onChange={setAutoFresh}
              />
            </section>
            <section>
              <label>刷新间隔：</label>
              <InputNumber
                disabled={!autoFresh}
                value={freshDelay}
                onChange={setFreshDelay}
                placeholder="1~60分钟"
                precision={0}
                min={1}
                max={60}
                size="small"
              />
            </section>
            <section>
              <label>自动检查更新：</label>
              <Switch
                size="small"
                checked={autoCheckUpdate}
                onChange={setAutoCheckUpdate}
              />
            </section>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <LinkIcon />
            <span>关于 Fishing Funds</span>
          </div>
          <div className={styles.link}>
            <a
              onClick={(e) =>
                shell.openExternal('https://github.com/1zilc/fishing-funds')
              }
            >
              联系作者
            </a>
            <i></i>
            <a onClick={(e) => shell.openExternal('https://ff.1zilc.top')}>
              官方网站
            </a>
            <i></i>
            <a onClick={(e) => shell.openExternal('https://ff.1zilc.top/blog')}>
              更新日志
            </a>
          </div>
        </div>
      </div>

      <div className={styles.exit}>
        <button type="button" onClick={() => app.quit()}>
          退出程序
        </button>
      </div>
      <div className={styles.version}>
        <div>Based on Electron v{process.versions.electron}</div>
      </div>
    </CustomDrawerContent>
  );
};

export default SettingContent;
