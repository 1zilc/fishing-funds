import React, { useRef } from 'react';
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
}

const ViewerContent: React.FC<ViewerContentProps> = (props) => {
  const { title, url } = props;
  const viewRef = useRef<any>(null);

  return (
    <CustomDrawerContent title={title} onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        {url && <webview ref={viewRef} src={url} style={{ width: '100%', flex: '1' }} />}
        <div className={styles.nav}>
          <ArrowLeftIcon onClick={() => viewRef.current?.goBack()} />
          <RefreshIcon onClick={() => viewRef.current?.reload()} />
          <ArrowRightIcon onClick={() => viewRef.current?.goForward()} />
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default ViewerContent;
