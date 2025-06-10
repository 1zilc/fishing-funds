import React, { useState } from 'react';
import { Tabs, Input, Switch } from 'antd';
import clsx from 'clsx';
import { RiOpenaiFill, RiSettingsLine } from 'react-icons/ri';
import WebAppIcon from '@/components/Toolbar/AppCenterContent/WebAppIcon';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StandCard from '@/components/Card/StandCard';
import PureCard from '@/components/Card/PureCard';
import Guide from '@/components/Guide';
import { setChatGPTSettingAction } from '@/store/features/chatGPT';
import { useAppDispatch, useAppSelector, useInputShortcut } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';

interface ChatGPTSettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}
const appName = 'ChatGPT';

const ChatGPTSettingContent: React.FC<ChatGPTSettingContentProps> = (props) => {
  const dispatch = useAppDispatch();
  const { hotkeySetting, chatIdSetting, cachedSetting } = useAppSelector((state) => state.chatGPT.chatGPTSetting);

  const [chatId, setChatId] = useState(chatIdSetting);
  const [cached, setCached] = useState(cachedSetting);
  const { hotkey, onBlur: hotkeyInputOnBlur, onFocus: hotkeyInputOnFocus, reset: resetHotkey } = useInputShortcut(hotkeySetting);

  function onSave() {
    dispatch(
      setChatGPTSettingAction({
        hotkeySetting: hotkey,
        chatIdSetting: chatId,
        cachedSetting: cached,
      })
    );
    props.onEnter();
  }

  return (
    <CustomDrawerContent title={appName} enterText="保存" onClose={props.onClose} onEnter={onSave}>
      <div className={styles.content}>
        <PureCard className={clsx(styles.logoContent, 'card-body')}>
          <WebAppIcon title={appName} iconType={Enums.WebIconType.Svg} svg={<RiOpenaiFill />} color="#80A89C" />
        </PureCard>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: 'ChatGPT设置',
                children: (
                  <>
                    <StandCard
                      icon={<RiSettingsLine />}
                      title="基础设置"
                      extra={
                        <div className={styles.guide}>
                          <Guide
                            list={[
                              { name: '快捷键', text: '设置快捷键显示/隐藏ChatGPT' },
                              { name: '会话id', text: '网址中提取，可忽略，自动填充' },
                              { name: '保留窗口', text: '不会销毁窗口，每次打开速度更快，资源占用更高' },
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
                        <section>
                          <label>会话id：</label>
                          <Input
                            value={chatId}
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            type="text"
                            onChange={(e) => setChatId(e.target.value)}
                          />
                        </section>
                        <section>
                          <label>保留窗口：</label>
                          <Switch size="small" checked={cached} onChange={setCached} />
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
