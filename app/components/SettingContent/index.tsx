import React from 'react';
import classnames from 'classnames';
import Tilt from 'react-tilt';

import wechatQRcodeImage from 'assets/qrcode/wechat.png';
import alipayQRcodeImage from 'assets/qrcode/alipay.png';
import { ReactComponent as QRcodeIcon } from 'assets/icons/QRcode.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/link.svg';
import styles from './index.scss';
import commonStyles from '../../styles/common.scss';
export interface SettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}
const SettingContent: React.FC<SettingContentProps> = props => {
  return (
    <div className={classnames(styles.content)}>
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
        <div>
          <div className={styles.title}>
            <SettingIcon />
            <span>通用设置</span>
          </div>
          <div></div>
        </div>
        <div>
          <div className={styles.title}>
            <QRcodeIcon />
            <span>支付宝支持一下～</span>
          </div>
          <div className={styles.pay}>
            <Tilt
              options={{ max: 25 }}
              className={classnames(styles.qrcode, styles.alipay)}
            >
              <img src={alipayQRcodeImage} />
            </Tilt>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <QRcodeIcon />
            <span>微信支持一下～</span>
          </div>
          <div className={styles.pay}>
            <Tilt
              options={{ max: 25 }}
              className={classnames(styles.qrcode, styles.wechat)}
            >
              <img src={wechatQRcodeImage} />
            </Tilt>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <LinkIcon />
            <span>联系作者</span>
          </div>
          <div className={styles.link}>
            <a>https://github.com/1zilc/fishing-funds</a>
          </div>
        </div>
      </div>
      <div className={styles.version}>version 1.0.0</div>
    </div>
  );
};

export default SettingContent;
