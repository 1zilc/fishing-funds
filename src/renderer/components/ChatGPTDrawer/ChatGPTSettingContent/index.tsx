import React from 'react';
import { Tabs, Input } from 'antd';
import clsx from 'clsx';
import OpenAIIcon from '@/static/icon/openai.svg';
import SettingIcon from '@/static/icon/setting.svg';
import WebAppIcon from '@/components/Toolbar/AppCenterContent/WebAppIcon';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StandCard from '@/components/Card/StandCard';
import PureCard from '@/components/Card/PureCard';
import Guide from '@/components/Guide';
import { setChatGPTSettingAction } from '@/store/features/chatGPT';
import { useAppDispatch, useAppSelector, useInputShortcut } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

interface ChatGPTSettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}
const appName = 'ChatGPT';

const ChatGPTSettingContent: React.FC<ChatGPTSettingContentProps> = (props) => {
  const dispatch = useAppDispatch();
  const { hotkeySetting } = useAppSelector((state) => state.chatGPT.chatGPTSetting);

  const { hotkey, onBlur: hotkeyInputOnBlur, onFocus: hotkeyInputOnFocus, reset: resetHotkey } = useInputShortcut(hotkeySetting);

  function onSave() {
    dispatch(
      setChatGPTSettingAction({
        hotkeySetting: hotkey,
      })
    );
    props.onEnter();
  }

  return (
    <CustomDrawerContent title={appName} enterText="保存" onClose={props.onClose} onEnter={onSave}>
      <div className={styles.content}>
        <PureCard className={clsx(styles.logoContent, 'card-body')}>
          <WebAppIcon title={appName} iconType={Enums.WebIconType.Svg} svg={<OpenAIIcon />} color="#80A89C" />
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
                    <StandCard
                      icon={<SettingIcon />}
                      title="基础设置"
                      extra={
                        <div className={styles.guide}>
                          <Guide
                            list={[
                              { name: '快捷键', text: '设置快捷键显示/隐藏ChatGPT' },
                              { name: '网络代理', text: '建议将软件代理设置为"系统"' },
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

export default ChatGPTSettingContent;
