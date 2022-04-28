import React, { useRef, useEffect, useState } from 'react';
import { Dropdown, Progress, Switch } from 'antd';
import { useBoolean, useMemoizedFn, useEventListener } from 'ahooks';

import StarIcon from '@/static/icon/star.svg';
import CopyIcon from '@/static/icon/copy.svg';
import StarFillIcon from '@/static/icon/star-fill.svg';
import ArrowLeftIcon from '@/static/icon/arrow-left.svg';
import ArrowRightIcon from '@/static/icon/arrow-right.svg';
import RefreshIcon from '@/static/icon/refresh.svg';
import ToolsIcon from '@/static/icon/tools.svg';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';

import { closeWebAction, addWebAction, deleteWebAction, syncWebPhoneAction, syncWebUrlAction } from '@/store/features/web';
import { useDrawer, useAppDispatch, useAppSelector, useIpcRendererListener } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

const AddWebContent = React.lazy(() => import('@/components/WebViewer/AddWebContent'));

interface ViewerContentProps {}

const { clipboard, dialog, ipcRenderer, shell } = window.contextModules.electron;

const defaultAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';

const Content = () => {
  const dispatch = useAppDispatch();
  const viewRef = useRef<any>(null);
  const { codeMap } = useAppSelector((state) => state.web.config);
  const { url, phone, show, title } = useAppSelector((state) => state.web.view);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [currentTitle, setCurrentTitle] = useState(title);

  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] = useBoolean(false);
  const [done, { setTrue: setDoneTrue, setFalse: setDoneFalse }] = useBoolean(false);
  const [percent, setPercent] = useState(0);
  const [timer, setTimer] = useState<any>(0);
  const [favicons, setFavicons] = useState<string[]>([]);

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
    const url = viewRef.current?.getURL();
    if (url) {
      setAddWebContent({
        title: currentTitle,
        iconType: Enums.WebIconType.First,
        url,
      });
    }
  });

  const onAddWeb = useMemoizedFn((web: Web.SettingItem) => {
    dispatch(addWebAction(web));
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
      setCurrentTitle((_) => _ || viewRef.current.getTitle());
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
    'did-finish-load',
    () => {
      setCurrentTitle(viewRef.current.getTitle());
      setCurrentUrl(viewRef.current.getURL());
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

  return (
    <CustomDrawerContent title={currentTitle} enterText="跳转" onClose={() => dispatch(closeWebAction())} onEnter={onVisit}>
      <div className={styles.content}>
        {url ? (
          <webview
            ref={viewRef}
            src={url}
            style={{ width: '100%', flex: '1' }}
            useragent={phone ? defaultAgent : undefined}
            allowpopups="true"
          />
        ) : (
          <Empty text="404 Not Found" />
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
            <Dropdown
              overlay={
                <div className={styles.menu}>
                  <div className={styles.menuItem} onClick={onCopyUrl}>
                    <label>复制链接</label>
                    <CopyIcon />
                  </div>
                  <div className={styles.menuItem}>
                    <label>移动端标识</label>
                    <Switch checked={!!phone} onChange={onPhoneChange} size="small" />
                  </div>
                </div>
              }
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
      </div>
      <CustomDrawer show={showAddWebContent} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_TOP}>
        <AddWebContent web={{ ...webDetail, title: currentTitle }} onClose={closeAddWebContent} onEnter={onAddWeb} favicons={favicons} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};
// TODO:useragent待随机处理
const WebViewer: React.FC<ViewerContentProps> = () => {
  const { show } = useAppSelector((state) => state.web.view);

  return (
    <CustomDrawer show={show} zIndex={CONST.DEFAULT.DRAWER_ZINDEX_HEIGHT}>
      <Content />
    </CustomDrawer>
  );
};

export default WebViewer;
