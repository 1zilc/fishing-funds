import React, { useRef, useEffect, useState } from 'react';
import { Dropdown, Progress, Switch } from 'antd';
import { useRequest } from 'ahooks';
import clsx from 'clsx';
import { useBoolean, useMemoizedFn, useEventListener } from 'ahooks';

import StarIcon from '@/static/icon/star.svg';
import CopyIcon from '@/static/icon/copy.svg';
import GlobalIcon from '@/static/icon/global.svg';
import StarFillIcon from '@/static/icon/star-fill.svg';
import ArrowLeftIcon from '@/static/icon/arrow-left.svg';
import ArrowRightIcon from '@/static/icon/arrow-right.svg';
import RefreshIcon from '@/static/icon/refresh.svg';
import ToolsIcon from '@/static/icon/tools.svg';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import { RedirectSearchParams } from '@/containers/InitPage';
import { WebViewerPageParams } from '@/components/WebViewerDrawer/WebViewerPage';

import { closeWebAction, addWebAction, deleteWebAction, syncWebPhoneAction } from '@/store/features/web';
import { useDrawer, useAppDispatch, useAppSelector, useIpcRendererListener, useFakeUA } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const AddWebContent = React.lazy(() => import('@/components/WebViewerDrawer/AddWebContent'));

interface WebViewerDrawerProps {}

export type WebViewerProps = {
  url: string;
  phone?: boolean;
  title: string;
  full?: boolean;
  updateTitle?: (title: string) => void;
  updateUrl?: (title: string) => void;
};

interface WebViewerContentProps {}

const menuItemSize = { height: 14, width: 14 };

const { clipboard, dialog, ipcRenderer, shell } = window.contextModules.electron;

export const WebViewer: React.FC<WebViewerProps> = (props) => {
  const dispatch = useAppDispatch();
  const viewRef = useRef<any>(null);
  const { url, phone, title, full } = props;
  const { codeMap } = useAppSelector((state) => state.web.config);
  const show = useAppSelector((state) => state.web.show);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] = useBoolean(false);
  const [done, { setTrue: setDoneTrue, setFalse: setDoneFalse }] = useBoolean(false);
  const [percent, setPercent] = useState(0);
  const [timer, setTimer] = useState<any>(0);
  const [favicons, setFavicons] = useState<string[]>([]);

  const fakeUA = useFakeUA(!!phone);

  const {
    data: webDetail,
    show: showAddWebContent,
    set: setAddWebContent,
    close: closeAddWebContent,
  } = useDrawer({
    title: currentTitle,
    url: currentUrl,
    iconType: Enums.WebIconType.First,
  });

  const onCopyUrl = useMemoizedFn(() => {
    const url = viewRef.current?.getURL();
    if (url) {
      clipboard.writeText(url);
      dialog.showMessageBox({
        title: '复制成功',
        type: 'info',
        message: `已复制到粘贴板`,
      });
    }
  });

  const onVisit = useMemoizedFn(() => {
    const url = viewRef.current?.getURL();
    if (url) {
      shell.openExternal(url);
    }
  });

  const onSetWeb = useMemoizedFn(() => {
    if (currentUrl) {
      setAddWebContent({
        title: currentTitle,
        url: currentUrl,
        iconType: Enums.WebIconType.First,
      });
    }
  });

  const onAddWeb = useMemoizedFn(async (web: Web.SettingItem) => {
    await dispatch(addWebAction(web));
    closeAddWebContent();
  });

  const onRemoveWeb = useMemoizedFn(() => {
    dispatch(deleteWebAction(currentUrl));
  });

  const onPhoneChange = useMemoizedFn((phone) => dispatch(syncWebPhoneAction(phone)));

  useEventListener(
    'dom-ready',
    () => {
      const targetId = viewRef.current?.getWebContentsId();
      ipcRenderer.invoke('registry-webview', targetId);
    },
    { target: viewRef }
  );

  useEventListener(
    'did-start-loading',
    () => {
      setDoneFalse();
      setLoadingTrue();
    },
    { target: viewRef }
  );
  useEventListener(
    'page-title-updated',
    (res) => {
      setCurrentTitle(res.title);
    },
    { target: viewRef }
  );
  useEventListener(
    'did-navigate-in-page',
    (res) => {
      setCurrentUrl(res.url);
    },
    { target: viewRef }
  );
  useEventListener(
    'did-stop-loading',
    () => {
      setLoadingFalse();
      setTimeout(() => {
        setDoneTrue();
        setTimeout(() => {
          setPercent(0);
        }, 100);
      }, 200);
    },
    { target: viewRef }
  );
  useEventListener(
    'page-favicon-updated',
    (e) => {
      setFavicons(e.favicons);
    },
    { target: viewRef }
  );

  useIpcRendererListener('webview-new-window', (e, data) => {
    viewRef.current?.loadURL(data);
  });

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

  useEffect(() => {
    props.updateTitle?.(currentTitle);
  }, [currentTitle]);
  useEffect(() => {
    props.updateUrl?.(currentUrl);
  }, [currentUrl]);

  return (
    <div className={styles.content} style={{ height: full ? '100vh' : 'calc(100vh - 48px)' }}>
      {url ? (
        <webview
          ref={viewRef}
          src={url}
          style={{ width: '100%', flex: '1' }}
          useragent={fakeUA}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          allowpopups="true"
        />
      ) : (
        show && <Empty className={styles.empty} text="404 Not Found" />
      )}
      <div>
        <Progress
          percent={percent}
          status={loading ? 'active' : 'success'}
          size={['100%', 2]}
          trailColor="transparent"
          showInfo={false}
          strokeColor={done ? 'transparent' : 'var(--primary-color)'}
        />
        <div className={clsx(styles.nav, 'max-content')}>
          <Dropdown
            dropdownRender={() => (
              <div className={styles.menu}>
                <div className={styles.menuItem} onClick={onVisit}>
                  <label>浏览器打开</label>
                  <GlobalIcon {...menuItemSize} />
                </div>
                <div className={styles.menuItem} onClick={onCopyUrl}>
                  <label>复制链接</label>
                  <CopyIcon {...menuItemSize} />
                </div>
                <div className={styles.menuItem}>
                  <label>移动端标识</label>
                  <Switch checked={!!phone} onChange={onPhoneChange} size="small" />
                </div>
              </div>
            )}
            placement="topLeft"
          >
            <ToolsIcon />
          </Dropdown>
          <ArrowLeftIcon onClick={() => viewRef.current?.goBack()} />
          <RefreshIcon onClick={() => viewRef.current?.reload()} />
          <ArrowRightIcon onClick={() => viewRef.current?.goForward()} />
          {codeMap[currentUrl] ? <StarFillIcon onClick={onRemoveWeb} /> : <StarIcon onClick={onSetWeb} />}
        </div>
      </div>
      <CustomDrawer show={showAddWebContent} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_TOP}>
        <AddWebContent web={webDetail} onClose={closeAddWebContent} onEnter={onAddWeb} favicons={favicons} />
      </CustomDrawer>
    </div>
  );
};

export const WebViewerContent: React.FC<WebViewerContentProps> = () => {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.web.view);
  const [currentTitle, setCurrentTitle] = useState(view.title);
  const [currentUrl, setCurrentUrl] = useState(view.url);

  function onClose() {
    dispatch(closeWebAction());
  }

  function onOpenChildWindow() {
    const search = Utils.MakeSearchParams('', {
      _redirect: Utils.MakeSearchParams(CONST.ROUTES.DETAIL_WEBVIEWER, {
        ...view,
        title: currentTitle,
        url: currentUrl,
      } as WebViewerPageParams),
    } as RedirectSearchParams);
    ipcRenderer.invoke('open-child-window', { search });
  }

  return (
    <CustomDrawerContent title={currentTitle} enterText="多窗" onClose={onClose} onEnter={onOpenChildWindow}>
      <WebViewer url={view.url} phone={view.phone} title={view.title} updateTitle={setCurrentTitle} updateUrl={setCurrentUrl} />
    </CustomDrawerContent>
  );
};

// TODO:useragent待随机处理
const WebViewerDrawer: React.FC<WebViewerDrawerProps> = () => {
  const show = useAppSelector((state) => state.web.show);

  return (
    <CustomDrawer show={show} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_HEIGHT}>
      <WebViewerContent />
    </CustomDrawer>
  );
};

export default WebViewerDrawer;
