import React, { useRef } from 'react';
import { useRequest, useEventListener } from 'ahooks';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import { RedirectSearchParams } from '@/containers/InitPage';
import { WebViewerPageParams } from '@/components/WebViewerDrawer/WebViewerPage';
import { syncChatGPTShowAction, setChatGPTSettingAction } from '@/store/features/chatGPT';
import { useAppDispatch, useAppSelector, useFakeUA } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.css';

interface ChatGPTDrawerProps {}

interface ChatGPTContentProps {}

const { ipcRenderer } = window.contextModules.electron;
const openaiHost = 'https://chat.openai.com';

const ChatGPTContent: React.FC<ChatGPTContentProps> = () => {
  const dispatch = useAppDispatch();
  const chatIdSetting = useAppSelector((state) => state.chatGPT.chatGPTSetting.chatIdSetting);
  const viewRef = useRef<any>(null);

  const fakeUA = useFakeUA(false);
  const chatUrl = chatIdSetting ? `${openaiHost}/c/${chatIdSetting}` : openaiHost;
  const ready = !!fakeUA;

  function onClose() {
    dispatch(syncChatGPTShowAction(false));
  }

  function onOpenChildWindow() {
    const currentUrl = viewRef.current?.getURL();
    const search = Utils.MakeSearchParams('', {
      _redirect: Utils.MakeSearchParams(CONST.ROUTES.DETAIL_WEBVIEWER, {
        phone: false,
        title: 'ChatGPT',
        url: currentUrl,
      } as WebViewerPageParams),
    } as RedirectSearchParams);
    ipcRenderer.invoke('open-child-window', { search });
  }

  useEventListener(
    'did-navigate-in-page',
    (res) => {
      const [host, id] = (res.url as string).split('/c/');
      if (openaiHost === host && id) {
        dispatch(
          setChatGPTSettingAction({
            chatIdSetting: id,
          })
        );
      }
    },
    { target: viewRef }
  );

  return (
    <CustomDrawerContent
      classNames={styles.content}
      title="ChatGPT"
      enterText="多窗"
      onClose={onClose}
      onEnter={onOpenChildWindow}
    >
      {ready && <webview ref={viewRef} src={chatUrl} style={{ width: '100%', flex: '1' }} useragent={fakeUA} />}
    </CustomDrawerContent>
  );
};

// TODO:useragent待随机处理
const ChatGPTDrawer: React.FC<ChatGPTDrawerProps> = () => {
  const show = useAppSelector((state) => state.chatGPT.show);
  const cachedSetting = useAppSelector((state) => state.chatGPT.chatGPTSetting.cachedSetting);

  return (
    <CustomDrawer
      show={show}
      zIndex={CONST.DEFAULT.DRAWER_ZINDEX_HEIGHT}
      closeImmediately={!cachedSetting}
      cached={cachedSetting}
    >
      <ChatGPTContent />
    </CustomDrawer>
  );
};

export default ChatGPTDrawer;
