import React, { useRef, useState } from 'react';
import { useBoolean, useAsyncEffect } from 'ahooks';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import { APIOptions } from '@/components/TranslateDrawer/TranslateSettingContent';
import { RedirectSearchParams } from '@/containers/InitPage';
import { WebViewerPageParams } from '@/components/WebViewerDrawer/WebViewerPage';
import { syncTranslateShowAction } from '@/store/features/translate';
import { useAppDispatch, useAppSelector, useFakeUA } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.css';

interface TranslateDrawerProps {}

interface TranslateContentProps {}

const { clipboard, ipcRenderer } = window.contextModules.electron;

const TranslateContent: React.FC<TranslateContentProps> = () => {
  const dispatch = useAppDispatch();
  const viewRef = useRef<any>(null);
  const [ready, { setTrue }] = useBoolean(false);
  const [keyword, setKeyword] = useState('');
  const { translateApiTypeSetting, readClipboardSetting } = useAppSelector((state) => state.translate.translateSetting);

  const fakeUA = useFakeUA(true);

  const url = (() => {
    const api = Utils.GetCodeMap(APIOptions, 'code')[translateApiTypeSetting];
    return api.onTrans(keyword || '');
  })();

  function onClose() {
    dispatch(syncTranslateShowAction(false));
  }

  function onOpenChildWindow() {
    const currentUrl = viewRef.current?.getURL();
    const search = Utils.MakeSearchParams('', {
      _redirect: Utils.MakeSearchParams(CONST.ROUTES.DETAIL_WEBVIEWER, {
        phone: true,
        title: '快捷翻译',
        url: currentUrl,
      } as WebViewerPageParams),
    } as RedirectSearchParams);
    ipcRenderer.invoke('open-child-window', { search });
  }

  useAsyncEffect(async () => {
    if (readClipboardSetting) {
      const keyword = await clipboard.readText();
      setKeyword(keyword);
    }
    setTrue();
  }, [readClipboardSetting]);

  return (
    <CustomDrawerContent
      classNames={styles.content}
      title="快捷翻译"
      enterText="多窗"
      onClose={onClose}
      onEnter={onOpenChildWindow}
    >
      {ready && <webview ref={viewRef} src={url} style={{ width: '100%', flex: '1' }} useragent={fakeUA} />}
    </CustomDrawerContent>
  );
};

// TODO:useragent待随机处理
const TranslateDrawer: React.FC<TranslateDrawerProps> = () => {
  const show = useAppSelector((state) => state.translate.show);

  return (
    <CustomDrawer show={show} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_HEIGHT} closeImmediately>
      <TranslateContent />
    </CustomDrawer>
  );
};

export default TranslateDrawer;
