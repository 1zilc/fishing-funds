import React from 'react';
import classnames from 'classnames';
import Tilt from 'react-tilt';
import wechatQRcodeImage from '../../assets/qrcode/wechat.png';
import alipayQRcodeImage from '../../assets/qrcode/alipay.png';

import { ReactComponent as WechatPayIcon } from '../../assets/icons/wechat-pay.svg';
import { ReactComponent as AliPayIcon } from '../../assets/icons/alipay.svg';

import styles from './index.scss';
export interface SettingContentProps {
  show?: boolean;
  onEnter: () => void;
  onClose: () => void;
}

const { remote, shell } = require('electron');
const { app } = remote;

const PayContent: React.FC<SettingContentProps> = (props) => {
  return (
    <div className={classnames(styles.content)}>
      <div className={styles.header}>
        <button className={styles.close} onClick={props.onClose} type="button">
          关闭
        </button>
        <h3>支持作者</h3>
        <button className={styles.add} onClick={props.onEnter} type="button">
          确定
        </button>
      </div>
      <div className={styles.body}>
        <div>
          <div className={styles.title}>
            <AliPayIcon />
            <span>支付宝支持一下～</span>
          </div>
          <div className={styles.pay}>
            <Tilt
              options={{ max: 10 }}
              className={classnames(styles.qrcode, styles.alipay)}
            >
              <img src={alipayQRcodeImage} />
            </Tilt>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <WechatPayIcon />
            <span>微信支持一下～</span>
          </div>
          <div className={styles.pay}>
            <Tilt
              options={{ max: 10 }}
              className={classnames(styles.qrcode, styles.wechat)}
            >
              <img src={wechatQRcodeImage} />
            </Tilt>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayContent;
