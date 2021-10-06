import React, { useState } from 'react';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { InputNumber, Radio, Badge, Switch, Slider, TimePicker } from 'antd';
import dayjs from 'dayjs';

import PureCard from '@/components/Card/PureCard';
import StandCard from '@/components/Card/StandCard';
import Logo from '@/components/Logo';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import PayCarousel from '@/components/PayCarousel';
import { ReactComponent as SettingIcon } from '@assets/icons/setting.svg';
import { ReactComponent as LinkIcon } from '@assets/icons/link.svg';
import { ReactComponent as LineCharIcon } from '@assets/icons/line-chart.svg';
import { ReactComponent as TShirtIcon } from '@assets/icons/t-shirt.svg';
import { ReactComponent as GlobalIcon } from '@assets/icons/global.svg';
import { ReactComponent as GroupIcon } from '@assets/icons/group.svg';
import { ReactComponent as NotificationIcon } from '@assets/icons/notification.svg';
import { ReactComponent as BitCoinIcon } from '@assets/icons/bit-coin.svg';
import { defalutSystemSetting } from '@/helpers/setting';
import { setSystemSettingAction } from '@/actions/setting';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface SettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const { shell, app, clipboard, dialog } = window.contextModules.electron;
const { electron, version } = window.contextModules.process;

const linksGroup = Utils.Group(
  [
    {
      url: 'mailto:dywzzjx@163.com',
      name: '联系作者',
    },
    {
      url: 'https://ff.1zilc.top',
      name: '官方网站',
    },
    {
      url: 'https://ff.1zilc.top/blog',
      name: '更新日志',
    },
    {
      url: 'https://github.com/1zilc/fishing-funds',
      name: 'Github',
    },
    {
      url: 'https://github.com/1zilc/fishing-funds/issues/new?assignees=&labels=&template=issue_template_bug.md',
      name: 'BUG反馈',
    },
    {
      url: 'https://github.com/1zilc/fishing-funds/issues/new?assignees=&labels=&template=issue_template_feature.md',
      name: '提出建议',
    },
  ],
  3
);

const recordSiteGroup = Utils.Group(
  [
    {
      url: 'https://lemon.qq.com/lab/app/FishingFunds.html',
      name: '柠檬精选',
    },
    {
      url: 'https://www.electronjs.org/apps/fishing-funds',
      name: 'Electron Apps',
    },
    {
      url: 'https://www.macwk.com/soft/fishing-funds',
      name: 'MacWk',
    },
    {
      url: 'https://snapcraft.io/fishing-funds',
      name: 'SnapStore',
    },
  ],
  3
);

export const APIOptions = [
  {
    name: '东方财富-天天基金',
    code: Enums.FundApiType.Eastmoney,
  },
  {
    name: '支付宝-蚂蚁基金',
    code: Enums.FundApiType.Ant,
  },
  {
    name: '同花顺-爱基金',
    code: Enums.FundApiType.Fund10jqka,
  },
  {
    name: '腾讯证券',
    code: Enums.FundApiType.Tencent,
  },
  {
    name: '新浪基金',
    code: Enums.FundApiType.Sina,
  },
  {
    name: '基金速查网',
    code: Enums.FundApiType.Dayfund,
  },
  {
    name: '好买基金',
    code: Enums.FundApiType.Howbuy,
  },
  {
    name: '易天富',
    code: Enums.FundApiType.Etf,
  },
];

const SettingContent: React.FC<SettingContentProps> = (props) => {
  const dispatch = useDispatch();
  const {
    fundApiTypeSetting,
    conciseSetting,
    lowKeySetting,
    baseFontSizeSetting,
    systemThemeSetting,
    adjustmentNotificationSetting,
    adjustmentNotificationTimeSetting,
    riskNotificationSetting,
    trayContentSetting,
    coinUnitSetting,
    autoStartSetting,
    autoFreshSetting,
    freshDelaySetting,
    autoCheckUpdateSetting,
    timestampSetting,
  } = useSelector((state: StoreState) => state.setting.systemSetting);
  const updateInfo = useSelector((state: StoreState) => state.updater.updateInfo);
  const isUpdateAvaliable = !!updateInfo.version;

  // 数据来源
  const [fundapiType, setFundApiType] = useState(fundApiTypeSetting);
  // 外观设置
  const [concise, setConcise] = useState(conciseSetting);
  const [lowKey, setLowKey] = useState(lowKeySetting);
  const [baseFontSize, setBaseFontSize] = useState(baseFontSizeSetting);
  const [systemTheme, setSystemTheme] = useState(systemThemeSetting);
  // 通知设置
  const [adjustmentNotification, setAdjustmentNotification] = useState(adjustmentNotificationSetting);
  const [adjustmentNotificationTime, setAdjustmentNotifitationTime] = useState(adjustmentNotificationTimeSetting);
  const [riskNotification, setRiskNotification] = useState(riskNotificationSetting);
  const [trayContent, setTrayContent] = useState(trayContentSetting);
  // 货币单位
  const [coinUnit, setCoinUnitSetting] = useState(coinUnitSetting);
  // 通用设置
  const [autoStart, setAutoStart] = useState(autoStartSetting);
  const [autoFresh, setAutoFresh] = useState(autoFreshSetting);
  const [freshDelay, setFreshDelay] = useState(freshDelaySetting);
  const [autoCheckUpdate, setAutoCheckUpdate] = useState(autoCheckUpdateSetting);
  const [timestamp, setTimestamp] = useState(timestampSetting);

  function onSave() {
    dispatch(
      setSystemSettingAction({
        fundApiTypeSetting: fundapiType,
        conciseSetting: concise,
        lowKeySetting: lowKey,
        baseFontSizeSetting: baseFontSize,
        systemThemeSetting: systemTheme,
        adjustmentNotificationSetting: adjustmentNotification,
        adjustmentNotificationTimeSetting: adjustmentNotificationTime || defalutSystemSetting.adjustmentNotificationTimeSetting,
        riskNotificationSetting: riskNotification,
        trayContentSetting: trayContent,
        coinUnitSetting: coinUnit,
        autoStartSetting: autoStart,
        autoFreshSetting: autoFresh,
        freshDelaySetting: freshDelay || defalutSystemSetting.freshDelaySetting,
        autoCheckUpdateSetting: autoCheckUpdate,
        timestampSetting: timestamp,
      })
    );
    props.onEnter();
  }

  function onNavigate(url: string) {
    shell.openExternal(url);
  }

  function onCopyGroup(number: string) {
    clipboard.writeText(number);
    dialog.showMessageBox({
      title: '复制成功',
      type: 'info',
      message: `已复制到粘贴板`,
    });
  }

  return (
    <CustomDrawerContent title="设置" enterText="保存" onClose={props.onClose} onEnter={onSave}>
      <style>{` html { font-size: ${baseFontSize}px }`}</style>
      <div className={styles.content}>
        <PureCard
          className={classnames(
            styles.logo,
            {
              clickable: isUpdateAvaliable,
            },
            'card-body'
          )}
          onClick={() => isUpdateAvaliable && shell.openExternal('https://ff.1zilc.top/#download')}
        >
          <Logo />
          <Badge count={isUpdateAvaliable ? `v${updateInfo.version} 可更新` : 0} style={{ fontSize: 8 }} size="small">
            <div className={styles.appName}>Fishing Funds v{version}</div>
          </Badge>
        </PureCard>
        <StandCard icon={<LineCharIcon />} title="数据来源">
          <div className={classnames(styles.setting, 'card-body')}>
            <Radio.Group value={fundapiType} onChange={(e) => setFundApiType(e.target.value)}>
              {APIOptions.map((api) => (
                <Radio key={api.code} className={styles.radio} value={api.code}>
                  {api.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </StandCard>
        <StandCard icon={<TShirtIcon />} title="外观设置">
          <div className={classnames(styles.setting, 'card-body')}>
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
              <Slider min={11} max={14} style={{ flex: 0.5 }} defaultValue={baseFontSize} onChange={setBaseFontSize} step={0.1} />
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
        </StandCard>
        <StandCard icon={<NotificationIcon />} title="通知设置">
          <div className={classnames(styles.setting, 'card-body')}>
            <section>
              <label>调仓提醒：</label>
              <Switch size="small" checked={adjustmentNotification} onChange={setAdjustmentNotification} />
            </section>
            <section>
              <label>提醒时间：</label>
              <TimePicker
                disabled={!adjustmentNotification}
                allowClear={false}
                size="small"
                value={dayjs(adjustmentNotificationTime)}
                onChange={(v) => setAdjustmentNotifitationTime(dayjs(v).format())}
                format="HH:mm"
              />
            </section>
            <section>
              <label>涨跌提醒：</label>
              <Switch size="small" checked={riskNotification} onChange={setRiskNotification} />
            </section>
            <section>
              <label>托盘内容：</label>
              <Radio.Group
                optionType="button"
                size="small"
                buttonStyle="solid"
                options={[
                  { label: '收益', value: Enums.TrayContent.Sy },
                  { label: '收益率', value: Enums.TrayContent.Syl },
                  { label: '无', value: Enums.TrayContent.None },
                ]}
                onChange={(e) => setTrayContent(e.target.value)}
                value={trayContent}
              />
            </section>
          </div>
        </StandCard>
        <StandCard icon={<BitCoinIcon />} title="货币单位">
          <div className={classnames(styles.setting, 'card-body')}>
            <Radio.Group value={coinUnit} onChange={(e) => setCoinUnitSetting(e.target.value)}>
              <Radio className={styles.radio} value={Enums.CoinUnitType.Usd}>
                USD ($)
              </Radio>
              <Radio className={styles.radio} value={Enums.CoinUnitType.Cny}>
                CNY (¥)
              </Radio>
              <Radio className={styles.radio} value={Enums.CoinUnitType.Btc}>
                BTC (฿)
              </Radio>
            </Radio.Group>
          </div>
        </StandCard>
        <StandCard icon={<SettingIcon />} title="系统设置">
          <div className={classnames(styles.setting, 'card-body')}>
            <section>
              <label>开机自启：</label>
              <Switch size="small" checked={autoStart} onChange={setAutoStart} />
            </section>
            <section>
              <label>自动刷新：</label>
              <Switch size="small" checked={autoFresh} onChange={setAutoFresh} />
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
              <Switch size="small" checked={autoCheckUpdate} onChange={setAutoCheckUpdate} />
            </section>
            <section>
              <label>时间戳：</label>
              <Radio.Group
                optionType="button"
                size="small"
                buttonStyle="solid"
                options={[
                  { label: '本地', value: Enums.TimestampType.Local },
                  { label: '网络', value: Enums.TimestampType.Network },
                ]}
                onChange={(e) => setTimestamp(e.target.value)}
                value={timestamp}
              />
            </section>
          </div>
        </StandCard>
        <PayCarousel />
        <StandCard icon={<LinkIcon />} title="关于 Fishing Funds">
          <div className={classnames('card-body')}>
            <div className={classnames(styles.describe)}>
              Fishing Funds
              是一款个人开发小软件，开源后深受大家的喜爱，接受了大量宝贵的改进建议，感谢大家的反馈，作者利用空闲时间开发不易，您的支持可以给本项目的开发和完善提供巨大的动力，感谢对本软件的喜爱和认可
              :)
            </div>
            {linksGroup.map((links, index) => (
              <div key={index} className={styles.link}>
                {links.map((link) => (
                  <React.Fragment key={link.name}>
                    <a onClick={() => onNavigate(link.url)}>{link.name}</a>
                    <i />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </StandCard>
        <StandCard icon={<GroupIcon />} title="讨论交流">
          <div className={classnames(styles.group, 'card-body')}>
            <section>
              <label>QQ群：</label>
              <a onClick={() => onCopyGroup('732268738')}>732268738</a>
            </section>
            <section>
              <label>issues：</label>
              <a onClick={() => onNavigate('https://github.com/1zilc/fishing-funds/issues/106')}>#106</a>
            </section>
          </div>
        </StandCard>
        <StandCard icon={<GlobalIcon />} title="收录网站">
          <div className={classnames('card-body')}>
            {recordSiteGroup.map((links, index) => (
              <div key={index} className={styles.link}>
                {links.map((link) => (
                  <React.Fragment key={link.name}>
                    <a onClick={(e) => shell.openExternal(link.url)}>{link.name}</a>
                    <i />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </StandCard>
      </div>
      <div className={styles.exit}>
        <button type="button" onClick={() => app.quit()}>
          退出程序
        </button>
      </div>
      <div className={styles.version}>
        <div>Based on Electron v{electron}</div>
      </div>
    </CustomDrawerContent>
  );
};

export default SettingContent;
