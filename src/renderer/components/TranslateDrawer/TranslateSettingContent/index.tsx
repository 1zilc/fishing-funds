import React, { useState } from 'react';
import { Tabs, Radio, Input, Switch } from 'antd';
import clsx from 'clsx';
import TranslateIcon from '@/static/icon/translate.svg';
import SettingIcon from '@/static/icon/setting.svg';
import LineCharIcon from '@/static/icon/line-chart.svg';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StandCard from '@/components/Card/StandCard';
import PureCard from '@/components/Card/PureCard';
import Guide from '@/components/Guide';
import colorHash from '@/utils/colorHash';
import { setTranslateSettingAction } from '@/store/features/translate';
import { useAppDispatch, useAppSelector, useInputShortcut } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

interface TranslateSettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}
const appName = '快捷翻译';

export const APIOptions = [
  {
    name: '谷歌翻译',
    code: Enums.TranslateApiType.Google,
    onTrans: (keyword: string) => {
      return `https://translate.google.com/?sl=en&tl=zh-CN&text=${keyword}&op=translate`;
    },
  },
  {
    name: '百度翻译',
    code: Enums.TranslateApiType.BaiDu,
    onTrans: (keyword: string) => {
      return `https://fanyi.baidu.com/#zh/en/${keyword}`;
    },
  },
  {
    name: '有道翻译',
    code: Enums.TranslateApiType.YouDao,
    onTrans: (keyword: string) => {
      return `https://www.youdao.com/m/result?word=${keyword}&lang=en`;
    },
  },
];

const Logo: React.FC = () => {
  const color = colorHash.hex(appName);

  return (
    <div
      className={styles.logo}
      style={{
        background: color,
        boxShadow: `0 2px 5px ${color}`,
      }}
    >
      <TranslateIcon />
    </div>
  );
};

const TranslateSettingContent: React.FC<TranslateSettingContentProps> = (props) => {
  const dispatch = useAppDispatch();
  const { translateApiTypeSetting, readClipboardSetting, hotkeySetting } = useAppSelector((state) => state.translate.translateSetting);

  const [translateApiType, setTranslateApiType] = useState(translateApiTypeSetting);
  const { hotkey, onBlur: hotkeyInputOnBlur, onFocus: hotkeyInputOnFocus, reset: resetHotkey } = useInputShortcut(hotkeySetting);
  const [readClipboard, setReadClipboard] = useState(readClipboardSetting);

  function onSave() {
    dispatch(
      setTranslateSettingAction({
        translateApiTypeSetting: translateApiType,
        readClipboardSetting: readClipboard,
        hotkeySetting: hotkey,
      })
    );
    props.onEnter();
  }

  return (
    <CustomDrawerContent title={appName} enterText="保存" onClose={props.onClose} onEnter={onSave}>
      <div className={styles.content}>
        <PureCard className={clsx(styles.logoContent, 'card-body')}>
          <Logo />
          <div className={styles.appName}>{appName}</div>
        </PureCard>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '翻译设置',
                children: (
                  <>
                    <StandCard icon={<LineCharIcon />} title="数据来源">
                      <div className={clsx(styles.setting, 'card-body')}>
                        <Radio.Group value={translateApiType} onChange={(e) => setTranslateApiType(e.target.value)}>
                          {APIOptions.map((api) => (
                            <Radio key={api.code} className={styles.radio} value={api.code}>
                              {api.name}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </div>
                    </StandCard>
                    <StandCard
                      icon={<SettingIcon />}
                      title="基础设置"
                      extra={
                        <div className={styles.guide}>
                          <Guide
                            list={[
                              { name: '快捷键', text: '设置快捷键快速显示/隐藏翻译' },
                              { name: '自动填充', text: '当使用快捷键开启翻译后，将自动翻译剪贴板上的内容。' },
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
                          <label>自动填充剪贴板内容：</label>
                          <Switch size="small" checked={readClipboard} onChange={setReadClipboard} />
                        </section>
                      </div>
                    </StandCard>
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default TranslateSettingContent;
