import React, { useRef } from 'react';
import { useRequest, useEventListener } from 'ahooks';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import { RedirectSearchParams } from '@/containers/InitPage';
import { WebViewerPageParams } from '@/components/WebViewerDrawer/WebViewerPage';
import { syncChatGPTShowAction, syncChatIdAction } from '@/store/features/chatGPT';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface ChatGPTDrawerProps {}

interface ChatGPTContentProps {}

const { ipcRenderer } = window.contextModules.electron;
const openaiHost = 'https://chat.openai.com';

const ChatGPTContent: React.FC<ChatGPTContentProps> = () => {
  const dispatch = useAppDispatch();
  const chatId = useAppSelector((state) => state.chatGPT.chatId);
  const viewRef = useRef<any>(null);

  const { data: fakeUA } = useRequest(() => ipcRenderer.invoke('get-fakeUA'), {
    cacheKey: 'invoke-get-fakeUA',
    cacheTime: -1,
  });
  const chatUrl = chatId ? `${openaiHost}/c/${chatId}` : openaiHost;
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
        dispatch(syncChatIdAction(id));
      }
    },
    { target: viewRef }
  );

  return (
    <CustomDrawerContent classNames={styles.content} title="ChatGPT" enterText="多窗" onClose={onClose} onEnter={onOpenChildWindow}>
      {ready && <webview ref={viewRef} src={chatUrl} style={{ width: '100%', flex: '1' }} useragent={fakeUA} />}
    </CustomDrawerContent>
  );
};

// TODO:useragent待随机处理
const ChatGPTDrawer: React.FC<ChatGPTDrawerProps> = () => {
  const show = useAppSelector((state) => state.chatGPT.show);

  return (
    <CustomDrawer show={show} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_HEIGHT} closeImmediately>
      <ChatGPTContent />
    </CustomDrawer>
  );
};

export default ChatGPTDrawer;
