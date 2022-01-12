import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Progress } from 'antd';
import { useBoolean, useInterval } from 'ahooks';

import ArrowLeftIcon from '@/static/icon/arrow-left.svg';
import ArrowRightIcon from '@/static/icon/arrow-right.svg';
import RefreshIcon from '@/static/icon/refresh.svg';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

interface ViewerContentProps {
  onClose: () => void;
  onEnter: () => void;
  title: string;
  url: string;
  phone?: boolean;
}

const { clipboard, dialog } = window.contextModules.electron;

// TODO:useragent待随机处理
const ViewerContent: React.FC<ViewerContentProps> = (props) => {
  const { title, url, phone } = props;
  const viewRef = useRef<any>(null);
  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] = useBoolean(false);
  const [done, { setTrue: setDoneTrue, setFalse: setDoneFalse }] = useBoolean(false);
  const [percent, setPercent] = useState(0);
  const [timer, setTimer] = useState<any>(0);

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

  useEffect(() => {
    const newWindow = (e: any) => {
      if (e.url) {
        viewRef.current?.loadURL(e.url);
      }
    };
    const didStartLoading = () => {
      setDoneFalse();
      setLoadingTrue();
    };
    const didStopLoading = () => {
      setLoadingFalse();
      setTimeout(() => {
        setDoneTrue();
      }, 300);
    };
    viewRef.current?.addEventListener('new-window', newWindow);
    viewRef.current?.addEventListener('did-start-loading', didStartLoading);
    viewRef.current?.addEventListener('did-stop-loading', didStopLoading);
    return () => {
      viewRef.current?.removeEventListener('new-window', newWindow);
      viewRef.current?.removeEventListener('did-start-loading', didStartLoading);
      viewRef.current?.removeEventListener('did-stop-loading', didStopLoading);
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

  return (
    <CustomDrawerContent title={title} enterText="链接" onClose={props.onClose} onEnter={onCopyUrl}>
      <div className={styles.content}>
        {url && (
          <webview
            ref={viewRef}
            src={url}
            style={{ width: '100%', flex: '1' }}
            useragent={
              phone
                ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
                : undefined
            }
            allowpopups
            webpreferences="nativeWindowOpen = no"
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
            <ArrowLeftIcon onClick={() => viewRef.current?.goBack()} />
            <RefreshIcon onClick={() => viewRef.current?.reload()} />
            <ArrowRightIcon onClick={() => viewRef.current?.goForward()} />
          </div>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default ViewerContent;
