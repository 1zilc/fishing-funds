import React, { useState, startTransition } from 'react';
import clsx from 'clsx';
import { InputNumber, Radio, Badge, Switch, Slider, TimePicker, Input, Tabs, Select, Checkbox, Button, ColorPicker } from 'antd';
import dayjs from 'dayjs';
import { ReactSortable } from 'react-sortablejs';
import {
  RiSettingsLine,
  RiLineChartLine,
  RiTShirtLine,
  RiNotificationBadgeLine,
  RiBitCoinLine,
  RiInboxLine,
  RiGlobalLine,
  RiFolderSettingsLine,
  RiOpenaiFill,
  RiErrorWarningLine,
} from 'react-icons/ri';
import PureCard from '@/components/Card/PureCard';
import StandCard from '@/components/Card/StandCard';
import Logo from '@/components/Logo';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Guide from '@/components/Guide';
import Log from '@/components/Toolbar/SettingContent/Log';
import ThemeProvider from '@/components/ThemeProvider';
import More from '@/components/Toolbar/SettingContent/More';
import { setSystemSettingAction, defaultSystemSetting } from '@/store/features/setting';
import { useAppDispatch, useAppSelector, useAutoDestroySortableRef, useInputShortcut, useThemeColor } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';

export interface SettingContentProps {
  themeWrapperClass: string;
  onEnter: () => void;
  onClose: () => void;
  openSupport?: boolean;
}

const { shell, app, dialog } = window.contextModules.electron;
const { platform } = window.contextModules.process;

export const APIOptions = [
  {
    name: '东方财富-天天基金',
    code: Enums.FundApiType.Eastmoney,
    recommond: '★★★★★ (推荐)',
  },
  {
    name: '支付宝-蚂蚁基金',
    code: Enums.FundApiType.Ant,
    recommond: '★★★★☆',
  },
  {
    name: '同花顺-爱基金',
    code: Enums.FundApiType.Fund10jqka,
    recommond: '★★★★☆',
  },
  {
    name: '腾讯证券',
    code: Enums.FundApiType.Tencent,
    recommond: '★★★★☆',
  },
];

const presetColors = [
  '#F5222D',
  '#FA8C16',
  '#FADB14',
  '#8BBB11',
  '#52C41A',
  '#13A8A8',
  '#1677FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
];

const SettingContent: React.FC<SettingContentProps> = (props) => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const {
    fundApiTypeSetting,
    themeColorTypeSetting,
    customThemeColorSetting,
    alwaysOnTopSetting,
    conciseSetting,
    lowKeySetting,
    lowKeyDegreeSetting,
    opacitySetting,
    baseFontSizeSetting,
    systemThemeSetting,
    bottomTabsSetting,
    adjustmentNotificationSetting,
    adjustmentNotificationTimeSetting,
    riskNotificationSetting,
    trayContentSetting,
    traySimpleIncomeSetting,
    coinUnitSetting,
    proxyTypeSetting,
    proxyHostSetting,
    proxyPortSetting,
    hotkeySetting,
    autoStartSetting,
    autoFreshSetting,
    freshDelaySetting,
    autoCheckUpdateSetting,
    timestampSetting,
    syncConfigSetting,
    syncConfigPathSetting,
    openaiBaseURLSetting,
    openaiApiKeySetting,
    openaiBaseModelSetting,
    openaiImportFundsModelSetting,
  } = useAppSelector((state) => state.setting.systemSetting);
  const darkMode = useAppSelector((state) => state.setting.darkMode);
  const { updateInfo, currentVersion } = useAppSelector((state) => state.updater);
  const { originPrimaryColor } = useThemeColor();
  const isUpdateAvaliable = !!updateInfo.version;
  // 数据来源
  const [fundapiType, setFundApiType] = useState(fundApiTypeSetting);
  // 外观设置
  const [themeColorType, setThemeColorType] = useState(themeColorTypeSetting);
  const [customThemeColor, setCustomThemeColor] = useState(customThemeColorSetting);
  const [concise, setConcise] = useState(conciseSetting);
  const [alwaysOnTop, setAlwaysOnTop] = useState(alwaysOnTopSetting);
  const [lowKey, setLowKey] = useState(lowKeySetting);
  const [lowKeyDegree, setLowKeyDegree] = useState(lowKeyDegreeSetting);
  const [opacity, setOpacity] = useState(opacitySetting);
  const [baseFontSize, setBaseFontSize] = useState(baseFontSizeSetting);
  const [systemTheme, setSystemTheme] = useState(systemThemeSetting);
  // 底栏设置
  const [bottomTabs, setBottomTabs] = useState(bottomTabsSetting);
  // 通知设置
  const [adjustmentNotification, setAdjustmentNotification] = useState(adjustmentNotificationSetting);
  const [adjustmentNotificationTime, setAdjustmentNotifitationTime] = useState(adjustmentNotificationTimeSetting);
  const [riskNotification, setRiskNotification] = useState(riskNotificationSetting);
  const [trayContent, setTrayContent] = useState(trayContentSetting);
  const [traySimpleIncome, setTraySimpleIncome] = useState(traySimpleIncomeSetting);

  // 货币单位
  const [coinUnit, setCoinUnit] = useState(coinUnitSetting);
  // 代理设置
  const [proxyType, setProxyType] = useState(proxyTypeSetting);
  const [proxyHost, setProxyHost] = useState(proxyHostSetting);
  const [proxyPort, setProxyPort] = useState(proxyPortSetting);
  // 通用设置
  const { hotkey, onBlur: hotkeyInputOnBlur, onFocus: hotkeyInputOnFocus, reset: resetHotkey } = useInputShortcut(hotkeySetting);
  const [autoStart, setAutoStart] = useState(autoStartSetting);
  const [autoFresh, setAutoFresh] = useState(autoFreshSetting);
  const [freshDelay, setFreshDelay] = useState(freshDelaySetting);
  const [autoCheckUpdate, setAutoCheckUpdate] = useState(autoCheckUpdateSetting);
  const [timestamp, setTimestamp] = useState(timestampSetting);
  // 配置同步
  const [syncConfig, setSyncConfig] = useState(syncConfigSetting);
  const [syncConfigPath, setSyncConfigPath] = useState(syncConfigPathSetting);

  const proxyModeEnable = proxyType === Enums.ProxyType.Http || proxyType === Enums.ProxyType.Socks;
  const customThemeColorEnable = themeColorType === Enums.ThemeColorType.Custom;
  const darkModeEnable = systemTheme === Enums.SystemThemeType.Dark;
  const themeColor = customThemeColorEnable ? customThemeColor || originPrimaryColor : originPrimaryColor;

  // openai
  const [openaiBaseURL, setOpenaiBaseURL] = useState(openaiBaseURLSetting);
  const [openaiApiKey, setOpenaiApiKey] = useState(openaiApiKeySetting);
  const [openaiBaseModel, setOpenaiBaseModel] = useState(openaiBaseModelSetting);
  const [openaiImportFundsModel, setOpenaiImportFundsModel] = useState(openaiImportFundsModelSetting);

  const defaultActiveKey = props.openSupport ? '2' : '0';

  function onSave() {
    dispatch(
      setSystemSettingAction({
        fundApiTypeSetting: fundapiType,
        themeColorTypeSetting: themeColorType,
        customThemeColorSetting: customThemeColor || originPrimaryColor,
        alwaysOnTopSetting: alwaysOnTop,
        conciseSetting: concise,
        lowKeySetting: lowKey,
        lowKeyDegreeSetting: lowKeyDegree,
        opacitySetting: opacity,
        baseFontSizeSetting: baseFontSize,
        systemThemeSetting: systemTheme,
        bottomTabsSetting: bottomTabs.map((tab) => ({ key: tab.key, name: tab.name, show: tab.show })),
        adjustmentNotificationSetting: adjustmentNotification,
        adjustmentNotificationTimeSetting: adjustmentNotificationTime || defaultSystemSetting.adjustmentNotificationTimeSetting,
        riskNotificationSetting: riskNotification,
        trayContentSetting: trayContent,
        traySimpleIncomeSetting: traySimpleIncome,
        coinUnitSetting: coinUnit,
        proxyTypeSetting: proxyType,
        proxyHostSetting: proxyHost,
        proxyPortSetting: proxyPort,
        hotkeySetting: hotkey,
        autoStartSetting: autoStart,
        autoFreshSetting: autoFresh,
        freshDelaySetting: freshDelay || defaultSystemSetting.freshDelaySetting,
        autoCheckUpdateSetting: autoCheckUpdate,
        timestampSetting: timestamp,
        syncConfigSetting: syncConfig,
        syncConfigPathSetting: syncConfigPath,
        openaiBaseURLSetting: openaiBaseURL,
        openaiApiKeySetting: openaiApiKey,
        openaiBaseModelSetting: openaiBaseModel,
        openaiImportFundsModelSetting: openaiImportFundsModel,
      })
    );
    props.onEnter();
  }

  function onNavigate(url: string) {
    shell.openExternal(url);
  }

  function onBottomTabCheckChange(key: Enums.TabKeyType) {
    const tabsCheckedKeys = bottomTabs.filter(({ show }) => show).map(({ key }) => key);
    const disableTabsCheck = tabsCheckedKeys.length <= 1;

    setBottomTabs(
      bottomTabs.map((tab) => ({
        ...tab,
        show: tab.key === key ? (tab.show && disableTabsCheck ? tab.show : !tab.show) : tab.show, // 至少选择一个
      }))
    );
  }

  async function onSelectSyncConfigPath() {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: '选择路径',
      defaultPath: `Fishing-Funds-Sync.ff`,
      filters: [{ name: 'Fishing Funds', extensions: ['ff'] }],
      buttonLabel: '确认',
    });
    if (canceled) {
      return;
    }
    setSyncConfigPath(filePath!);
  }

  return (
    <ThemeProvider
      target={`.${props.themeWrapperClass}`}
      config={{
        darkMode: systemTheme === Enums.SystemThemeType.Auto ? darkMode : darkModeEnable,
        lowKey,
        lowKeyDegree,
        baseFontSize,
        primaryColor: themeColor,
      }}
    >
      <CustomDrawerContent title="设置" enterText="保存" onClose={props.onClose} onEnter={onSave}>
        <PureCard
          className={clsx(
            styles.logo,
            {
              clickable: isUpdateAvaliable,
            },
            'card-body'
          )}
          onClick={() => isUpdateAvaliable && onNavigate('https://ff.1zilc.top/#download')}
        >
          <Logo />
          <Badge count={isUpdateAvaliable ? `v${updateInfo.version} 可更新` : 0} style={{ fontSize: 8 }} size="small">
            <div className={styles.appName}>Fishing Funds v{currentVersion}</div>
          </Badge>
        </PureCard>
        <Tabs
          key={defaultActiveKey}
          defaultActiveKey={defaultActiveKey}
          animated={{ tabPane: true }}
          tabBarGutter={15}
          tabBarStyle={{ marginLeft: 15 }}
          items={[
            {
              key: String(0),
              label: '基础设置',
              children: (
                <div className={styles.content}>
                  <StandCard
                    icon={<RiLineChartLine />}
                    title="数据来源"
                    extra={
                      <div className={styles.guide}>
                        <Guide list={APIOptions.map(({ name, recommond }) => ({ name, text: recommond }))} />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
                      <Radio.Group value={fundapiType} onChange={(e) => setFundApiType(e.target.value)}>
                        {APIOptions.map((api) => (
                          <Radio key={api.code} className={styles.radio} value={api.code}>
                            {api.name}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </div>
                  </StandCard>
                  <StandCard
                    icon={<RiTShirtLine />}
                    title="外观设置"
                    extra={
                      <div className={styles.guide}>
                        <Guide
                          list={[
                            {
                              name: '总是置顶',
                              text: '始终显示在所有界面的最上层',
                            },
                            {
                              name: '简洁模式',
                              text: '简化界面显示数据，展示更多关键信息',
                            },
                            {
                              name: '低调模式',
                              text: '增强软件隐蔽性',
                            },
                            {
                              name: '低调程度',
                              text: '调节灰度和软件透明度（Linux不支持透明度设置）',
                            },
                          ]}
                        />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
                      <section>
                        <label>主题色：</label>
                        <Radio.Group
                          optionType="button"
                          size="small"
                          buttonStyle="solid"
                          options={[
                            { label: '默认', value: Enums.ThemeColorType.Default },
                            { label: '自定义', value: Enums.ThemeColorType.Custom },
                          ]}
                          onChange={(e) => setThemeColorType(e.target.value)}
                          value={themeColorType}
                        />
                      </section>
                      <section>
                        <label>自定义主题色 ：</label>
                        <div className={styles.colorBar}>
                          <ColorPicker
                            trigger="hover"
                            disabled={!customThemeColorEnable}
                            value={themeColor}
                            presets={[{ label: '推荐', colors: presetColors }]}
                            onChange={(v, hex) => {
                              startTransition(() => {
                                setCustomThemeColor(hex);
                              });
                            }}
                          >
                            <div className={styles.colorPicker} style={{ backgroundColor: themeColor }} />
                          </ColorPicker>
                        </div>
                      </section>
                      <section>
                        <label>总是置顶：</label>
                        <Switch size="small" checked={alwaysOnTop} onChange={setAlwaysOnTop} />
                      </section>
                      <section>
                        <label>简洁模式：</label>
                        <Switch size="small" checked={concise} onChange={setConcise} />
                      </section>
                      <section>
                        <label>低调模式：</label>
                        <Switch size="small" checked={lowKey} onChange={setLowKey} />
                      </section>
                      {lowKey && (
                        <section>
                          <label>灰度：</label>
                          <Slider
                            min={0}
                            max={100}
                            style={{ flex: 0.5 }}
                            defaultValue={lowKeyDegree}
                            onChange={setLowKeyDegree}
                            step={1}
                          />
                        </section>
                      )}
                      {lowKey && (
                        <section>
                          <label>透明度：</label>
                          <Slider
                            min={0.2}
                            max={1}
                            style={{ flex: 0.5 }}
                            defaultValue={opacity}
                            onChange={setOpacity}
                            step={0.01}
                          />
                        </section>
                      )}
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
                  </StandCard>
                  <StandCard
                    icon={<RiNotificationBadgeLine />}
                    title="通知设置"
                    extra={
                      <div className={styles.guide}>
                        <Guide
                          list={[
                            { name: '调仓提醒', text: '将在预设时间发出调仓通知' },
                            { name: '基金提醒', text: '开启后可在基金设置中配置自定义涨幅、净值提醒' },
                            { name: '托盘内容', text: '仅限macos客户端，菜单栏显示当日收益等信息' },
                          ]}
                        />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
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
                        <label>基金提醒：</label>
                        <Switch size="small" checked={riskNotification} onChange={setRiskNotification} />
                      </section>
                      {platform == 'darwin' && (
                        <section>
                          <label>托盘内容：</label>
                          <Select
                            mode="multiple"
                            size="small"
                            allowClear
                            style={{ width: '50%' }}
                            placeholder="无"
                            value={trayContent}
                            onChange={setTrayContent}
                          >
                            <Select.Option value={Enums.TrayContent.Sy}>选中钱包收益</Select.Option>
                            <Select.Option value={Enums.TrayContent.Syl}>选中钱包收益率</Select.Option>
                            <Select.Option value={Enums.TrayContent.Zsy}>所有钱包收益</Select.Option>
                            <Select.Option value={Enums.TrayContent.Zsyl}>所有钱包收益率</Select.Option>
                          </Select>
                        </section>
                      )}
                      {platform == 'darwin' && (
                        <section>
                          <label>简略收益：</label>
                          <Switch size="small" checked={traySimpleIncome} onChange={setTraySimpleIncome} />
                        </section>
                      )}
                    </div>
                  </StandCard>
                  <StandCard
                    icon={<RiInboxLine />}
                    title="底栏设置"
                    extra={
                      <div className={styles.guide}>
                        <Guide list={[{ name: '底栏设置', text: '对底部模块进行选择和排序' }]} />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
                      <ReactSortable
                        ref={sortableRef}
                        animation={200}
                        delay={2}
                        list={bottomTabs.map((_) => ({ ..._, id: _.key }))}
                        setList={setBottomTabs}
                        className={styles.bottomTabsRow}
                        swap
                      >
                        {bottomTabs.map((tab) => (
                          <PureCard key={tab.key}>
                            <div className={styles.bottomTabItem}>
                              <div>{tab.name}</div>
                              <Checkbox checked={tab.show} onClick={() => onBottomTabCheckChange(tab.key)} />
                            </div>
                          </PureCard>
                        ))}
                      </ReactSortable>
                    </div>
                  </StandCard>
                  <StandCard
                    icon={<RiBitCoinLine />}
                    title="货币单位"
                    extra={
                      <div className={styles.guide}>
                        <Guide list={[{ name: '货币单位', text: '仅用做货币模块单位换算，其余模块单位均为人民币' }]} />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
                      <Radio.Group value={coinUnit} onChange={(e) => setCoinUnit(e.target.value)}>
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
                  <StandCard icon={<RiGlobalLine />} title="代理设置">
                    <div className={clsx(styles.setting, 'card-body')}>
                      <section>
                        <label>代理模式：</label>
                        <Radio.Group
                          optionType="button"
                          size="small"
                          buttonStyle="solid"
                          options={[
                            { label: '无', value: Enums.ProxyType.None },
                            { label: '系统', value: Enums.ProxyType.System },
                            { label: 'http', value: Enums.ProxyType.Http },
                            { label: 'socks', value: Enums.ProxyType.Socks },
                          ]}
                          onChange={(e) => setProxyType(e.target.value)}
                          value={proxyType}
                        />
                      </section>
                      <section>
                        <label>代理地址：</label>
                        <Input
                          size="small"
                          value={proxyHost}
                          onChange={(e) => setProxyHost(e.target.value)}
                          disabled={!proxyModeEnable}
                        />
                      </section>
                      <section>
                        <label>代理端口：</label>
                        <Input
                          size="small"
                          value={proxyPort}
                          onChange={(e) => setProxyPort(e.target.value)}
                          disabled={!proxyModeEnable}
                        />
                      </section>
                    </div>
                  </StandCard>
                  <StandCard
                    icon={<RiSettingsLine />}
                    title="系统设置"
                    extra={
                      <div className={styles.guide}>
                        <Guide
                          list={[
                            { name: '快捷键', text: '设置快捷键快速显示/隐藏程序' },
                            { name: '自动刷新', text: '开启后将自动间隔预设时间进行数据刷新' },
                            { name: '刷新间隔', text: '单位（分钟）' },
                            {
                              name: '时间戳',
                              text: '当前时间节点默认使用淘宝、苏宁等网络时间戳，若自动刷新功能失效，请尝试切换到本地时间戳',
                            },
                          ]}
                        />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
                      <section>
                        <label>快捷键 {hotkey && <a onClick={resetHotkey}>(重置)</a>}：</label>
                        <Input
                          onBlur={hotkeyInputOnBlur}
                          onFocus={hotkeyInputOnFocus}
                          value={hotkey}
                          placeholder="请输入快捷键"
                          type="text"
                        />
                      </section>
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
                          onChange={(v) => setFreshDelay(v as number)}
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
                  <StandCard
                    icon={<RiFolderSettingsLine />}
                    title="配置同步"
                    extra={
                      <div className={styles.guide}>
                        <Guide
                          list={[
                            { name: '开启同步', text: '开启后自动存储配置文件至指定路径，启动时优先读取该路径配置' },
                            {
                              name: '同步路径',
                              text: '配置文件路径（通过iCloud、OneDrive等方式自动同步该文件至云端实现多台设备配置同步）',
                            },
                            { name: '同步范围', text: '支持钱包，基金，指数，板块，股票，货币，h5配置同步' },
                          ]}
                        />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
                      <section>
                        <label>开启同步：</label>
                        <Switch size="small" checked={syncConfig} onChange={setSyncConfig} />
                      </section>
                      <section>
                        <label>
                          同步路径
                          {!!syncConfigPath ? (
                            <a onClick={() => setSyncConfigPath('')}>(清除)</a>
                          ) : (
                            <a onClick={onSelectSyncConfigPath}>(选择)</a>
                          )}
                          ：
                        </label>
                        <Input size="small" value={syncConfigPath} disabled />
                      </section>
                    </div>
                  </StandCard>
                </div>
              ),
            },
            {
              key: String(1),
              label: 'AI',
              children: (
                <div className={styles.content}>
                  <StandCard icon={<RiErrorWarningLine />} title="声明">
                    <div className={clsx('card-body')}>
                      Fishing Funds不收集上传用户apikey，请确保软件从官方渠道获取，如有疑问请忽略ai相关功能
                    </div>
                  </StandCard>
                  <StandCard
                    icon={<RiOpenaiFill />}
                    title="OpenAI"
                    extra={
                      <div className={styles.guide}>
                        <Guide
                          list={[
                            {
                              name: 'BaseURL',
                              text: `openai api 地址 如
                              https://api.openai.com/v1/、
                              https://generativelanguage.googleapis.com/v1beta/openai/、
                              http://127.0.0.1:11434/v1/ 等`,
                            },
                            {
                              name: 'ApiKey',
                              text: 'openai api 密钥',
                            },
                            { name: '基础模型', text: '默认基础模型' },
                            {
                              name: '基金导入模型',
                              text: '专用于基金导入的模型，确保模型具有vision功能，推荐gpt-4o、qwen2.5vl:32b及以上，为空时使用基础模型。',
                            },
                          ]}
                        />
                      </div>
                    }
                  >
                    <div className={clsx(styles.setting, 'card-body')}>
                      <section>
                        <label>BaseURL：</label>
                        <Input size="small" value={openaiBaseURL} onChange={(e) => setOpenaiBaseURL(e.target.value)} />
                      </section>
                      <section>
                        <label>ApiKey：</label>
                        <Input size="small" value={openaiApiKey} onChange={(e) => setOpenaiApiKey(e.target.value)} />
                      </section>
                      <section>
                        <label>基础模型：</label>
                        <Input size="small" value={openaiBaseModel} onChange={(e) => setOpenaiBaseModel(e.target.value)} />
                      </section>
                      <section>
                        <label>基金导入模型：</label>
                        <Input
                          size="small"
                          value={openaiImportFundsModel}
                          onChange={(e) => setOpenaiImportFundsModel(e.target.value)}
                        />
                      </section>
                    </div>
                  </StandCard>
                </div>
              ),
            },
            {
              key: String(2),
              label: '更新日志',
              children: <Log />,
            },
            {
              key: String(3),
              label: '更多信息',
              children: <More />,
            },
          ]}
        />
        <div className={styles.exit}>
          <Button type="text" onClick={() => app.quit()}>
            退出程序
          </Button>
        </div>
      </CustomDrawerContent>
    </ThemeProvider>
  );
};

export default SettingContent;
