import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Progress } from 'antd';
import { useBoolean } from 'ahooks';
import { useSelector, useDispatch } from 'react-redux';

import StarIcon from '@/static/icon/star.svg';
import CopyIcon from '@/static/icon/copy.svg';
import StarFillIcon from '@/static/icon/star-fill.svg';
import ArrowLeftIcon from '@/static/icon/arrow-left.svg';
import ArrowRightIcon from '@/static/icon/arrow-right.svg';
import RefreshIcon from '@/static/icon/refresh.svg';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import AddWebContent from '@/components/WebViewer/AddWebContent';
import { StoreState } from '@/reducers/types';
import { closeWebAction, addWebAction, deleteWebAction } from '@/actions/web';
import { useDrawer } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

interface ViewerContentProps {}

const { clipboard, dialog, ipcRenderer, shell } = window.contextModules.electron;

const defaultAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';

const Content = () => {
  const dispatch = useDispatch();
  const { url, phone, show, title } = useSelector((state: StoreState) => state.web.view);
  const { codeMap } = useSelector((state: StoreState) => state.web.config);
  const viewRef = useRef<any>(null);
  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] = useBoolean(false);
  const [done, { setTrue: setDoneTrue, setFalse: setDoneFalse }] = useBoolean(false);
  const [percent, setPercent] = useState(0);
  const [webTitle, setWebTitle] = useState(title);
  const [timer, setTimer] = useState<any>(0);
  const [favicons, setFavicons] = useState<string[]>([]);

  const {
    data: webDetail,
    show: showAddWebContent,
    open: openAddWebContent,
    close: closeAddWebContent,
  } = useDrawer({
    title: webTitle,
    url: url,
    iconType: Enums.WebIconType.First,
  });

  const onCopyUrl = useCallback(() => {
    const url = viewRef.current?.getURL();
    if (url) {
      clipboard.writeText(url);
      dialog.showMessageBox({
        title: '复制成功',
        type: 'info',
        message: `已复制到粘贴板`,
      });
    }
  }, []);

  const onVisit = useCallback(() => {
    const url = viewRef.current?.getURL();
    if (url) {
      shell.openExternal(url);
    }
  }, []);

  const onAddWeb = useCallback((web: Web.SettingItem) => {
    dispatch(addWebAction(web));
    closeAddWebContent();
  }, []);

  const onRemoveWeb = useCallback(() => {
    dispatch(deleteWebAction(url));
  }, []);

  useEffect(() => {
    const didStartLoading = () => {
      setDoneFalse();
      setLoadingTrue();
    };
    const didStopLoading = () => {
      setLoadingFalse();
      setTimeout(() => {
        setDoneTrue();
        setTimeout(() => {
          setPercent(0);
        }, 100);
      }, 200);
    };
    const domReady = () => {
      const targetId = viewRef.current?.getWebContentsId();
      ipcRenderer.invoke('registry-webview', targetId);
      setWebTitle((_) => _ || viewRef.current.getTitle());
    };
    const pageFaviconUpdated = (e: any) => {
      setFavicons(e.favicons);
    };

    viewRef.current?.addEventListener('dom-ready', domReady);
    viewRef.current?.addEventListener('did-start-loading', didStartLoading);
    viewRef.current?.addEventListener('did-stop-loading', didStopLoading);
    viewRef.current?.addEventListener('page-favicon-updated', pageFaviconUpdated);
    ipcRenderer.on('webview-new-window', (e, data) => {
      viewRef.current?.loadURL(data);
    });

    return () => {
      viewRef.current?.removeEventListener('dom-ready', domReady);
      viewRef.current?.removeEventListener('did-start-loading', didStartLoading);
      viewRef.current?.removeEventListener('did-stop-loading', didStopLoading);
      viewRef.current?.removeEventListener('page-favicon-updated', pageFaviconUpdated);
      ipcRenderer.removeAllListeners('webview-new-window');
    };
  }, []);

  useEffect(() => {
    if (loading) {
      setPercent(0);
      const t = setInterval(() => {
        setPercent((p) => p + ((99 - 10) / 5) * Math.random());
      }, 300);
      setTimer(t);
    } else {
      setPercent(100);
    }
  }, [loading]);

  useEffect(() => {
    if (percent === 100) {
      clearInterval(timer);
    }
  }, [percent, timer]);

  useEffect(() => {
    if (!show) {
      setLoadingFalse();
      setDoneFalse();
      setPercent(0);
    }
  }, [show]);

  return (
    <CustomDrawerContent title={webTitle} enterText="跳转" onClose={() => dispatch(closeWebAction())} onEnter={onVisit}>
      <div className={styles.content}>
        {url && (
          <webview
            ref={viewRef}
            src={url}
            style={{ width: '100%', flex: '1' }}
            useragent={phone ? defaultAgent : undefined}
            allowpopups="true"
          />
        )}
        <div>
          <Progress
            percent={percent}
            status={loading ? 'active' : 'success'}
            strokeWidth={2}
            trailColor="transparent"
            showInfo={false}
            strokeColor={done ? 'transparent' : 'var(--primary-color)'}
          />
          <div className={styles.nav}>
            <CopyIcon onClick={onCopyUrl} />
            <ArrowLeftIcon onClick={() => viewRef.current?.goBack()} />
            <RefreshIcon onClick={() => viewRef.current?.reload()} />
            <ArrowRightIcon onClick={() => viewRef.current?.goForward()} />
            {codeMap[url] ? <StarFillIcon onClick={onRemoveWeb} /> : <StarIcon onClick={openAddWebContent} />}
          </div>
        </div>
      </div>
      <CustomDrawer show={showAddWebContent} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_TOP}>
        <AddWebContent web={{ ...webDetail, title: webTitle }} onClose={closeAddWebContent} onEnter={onAddWeb} favicons={favicons} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};
// TODO:useragent待随机处理
const WebViewer: React.FC<ViewerContentProps> = () => {
  const { show } = useSelector((state: StoreState) => state.web.view);

  return (
    <CustomDrawer show={show} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_HEIGHT}>
      <Content />
    </CustomDrawer>
  );
};

export default WebViewer;
