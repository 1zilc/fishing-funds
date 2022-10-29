import React, { useRef, useState, useMemo } from 'react';
import { useBoolean, useAsyncEffect } from 'ahooks';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import { defaultAgent } from '@/components/WebViewerDrawer';
import { APIOptions } from '@/components/TranslateDrawer/TranslateSettingContent';
import { syncTranslateShowAction } from '@/store/features/translate';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface TranslateDrawerProps {}

interface TranslateContentProps {}

const { clipboard, ipcRenderer } = window.contextModules.electron;

const TranslateContent: React.FC<TranslateContentProps> = () => {
  const dispatch = useAppDispatch();
  const viewRef = useRef<any>(null);
  const [ready, { setTrue }] = useBoolean(false);
  const [keyword, setKeyword] = useState('');
  const { translateApiTypeSetting, readClipboardSetting } = useAppSelector((state) => state.translate.translateSetting);

  const url = useMemo(() => {
    const api = Utils.GetCodeMap(APIOptions, 'code')[translateApiTypeSetting];
    return api.onTrans(keyword || '');
  }, [translateApiTypeSetting, keyword]);

  function onClose() {
    dispatch(syncTranslateShowAction(false));
  }

  function onOpenChildWindow() {
    const currentUrl = viewRef.current?.getURL();
    const search = Utils.MakeSearchParams({
      _nav: '/detail/webViewer',
      data: {
        phone: true,
        title: '翻译',
        url: currentUrl,
      },
    });
    ipcRenderer.invoke('open-child-window', { search });
  }

  useAsyncEffect(async () => {
    if (readClipboardSetting) {
      const keyword = await clipboard.readText();
      setKeyword(keyword);
    }
    setTrue();
  }, [readClipboardSetting]);
  console.log(url, readClipboardSetting);

  return (
    <CustomDrawerContent classNames={styles.content} title="翻译" enterText="多窗" onClose={onClose} onEnter={onOpenChildWindow}>
      {ready && <webview ref={viewRef} src={url} style={{ width: '100%', flex: '1' }} useragent={defaultAgent} />}
    </CustomDrawerContent>
  );
};

// TODO:useragent待随机处理
const TranslateDrawer: React.FC<TranslateDrawerProps> = () => {
  const show = useAppSelector((state) => state.translate.show);

  return (
    <CustomDrawer show={show} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_HEIGHT}>
      <TranslateContent />
    </CustomDrawer>
  );
};

export default TranslateDrawer;
