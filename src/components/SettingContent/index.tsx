import React, { useState } from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { InputNumber, Radio, Badge, Switch } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { ReactComponent as SettingIcon } from '@/assets/icons/setting.svg';
import { ReactComponent as LinkIcon } from '@/assets/icons/link.svg';
import { ReactComponent as LineCharIcon } from '@/assets/icons/line-chart.svg';
import { ReactComponent as TShirtIcon } from '@/assets/icons/t-shirt.svg';

import Logo from '@/components/Logo';

import {
  getSystemSetting,
  setSystemSetting,
  getFundApiTypeSetting,
  setFundApiTypeSetting,
} from '@/actions/setting';
import { StoreState } from '@/reducers/types';

import * as Enums from '@/utils/enums';
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
    conciseSetting,
    lowKeySetting,
    autoStartSetting,
    autoFreshSetting,
    freshDelaySetting,
    autoCheckUpdateSetting,
  } = getSystemSetting();

  const updateInfo = useSelector(
    (state: StoreState) => state.updater.updateInfo
  );
  const isUpdateAvaliable = !!updateInfo.version;

  // 数据来源
  const fundApiTypeSetting = getFundApiTypeSetting();
  // 外观设置
  const [concise, setConcise] = useState(conciseSetting);
  const [lowKey, setLowKey] = useState(lowKeySetting);
  // 通用设置
  const [autoStart, setAutoStart] = useState(autoStartSetting);
  const [autoFresh, setAutoFresh] = useState(autoFreshSetting);
  const [freshDelay, setFreshDelay] = useState(freshDelaySetting);
  const [fundapiType, setFundApiType] = useState(fundApiTypeSetting);
  const [autoCheckUpdate, setAutoCheckUpdate] = useState(
    autoCheckUpdateSetting
  );

  const onSave = () => {
    setFundApiTypeSetting(fundapiType);
    setSystemSetting({
      conciseSetting: concise,
      lowKeySetting: lowKey,
      autoStartSetting: autoStart,
      autoFreshSetting: autoFresh,
      freshDelaySetting: freshDelay || 1,
      autoCheckUpdateSetting: autoCheckUpdate,
    });
    app.setLoginItemSettings({
      openAtLogin: autoStart,
    });
    props.onEnter();
  };

  return (
    <CustomDrawerContent
      title="设置"
      enterText="保存"
      onClose={props.onClose}
      onEnter={onSave}
    >
      <div className={styles.content}>
        <div
          className={classnames(styles.logo, {
            clickable: isUpdateAvaliable,
          })}
          onClick={() =>
            isUpdateAvaliable &&
            shell.openExternal(
              'https://github.com/1zilc/fishing-funds/releases'
            )
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
                className={styles.input}
                placeholder="1~60分"
                precision={0}
                min={1}
                max={60}
                size="small"
                style={{
                  width: '100%',
                }}
              />
            </section>
            <section>
              <label>检查更新：</label>
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
            <span>联系作者</span>
          </div>
          <div className={styles.link}>
            <a onClick={(e) => shell.openExternal(e.target.innerHTML)}>
              https://github.com/1zilc/fishing-funds
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
