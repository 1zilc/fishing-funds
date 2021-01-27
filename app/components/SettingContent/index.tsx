import React from 'react';
import styles from './index.scss';

export interface SettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}
const SettingContent: React.FC<SettingContentProps> = props => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <button className={styles.close} onClick={props.onClose}>
          关闭
        </button>
        <h3>设置</h3>
        <button className={styles.add} onClick={props.onEnter}>
          保存
        </button>
      </div>
      <div className={styles.body}>
        
      </div>
    </div>
  );
};

export default SettingContent;
