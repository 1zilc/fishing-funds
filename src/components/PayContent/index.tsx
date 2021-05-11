import React from 'react';
import classnames from 'classnames';
import Tilt from 'react-tilt';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import wechatQRcodeImage from '@/assets/qrcode/wechat.png';
import alipayQRcodeImage from '@/assets/qrcode/alipay.png';
import { ReactComponent as WechatPayIcon } from '@/assets/icons/wechat-pay.svg';
import { ReactComponent as AliPayIcon } from '@/assets/icons/alipay.svg';

import styles from './index.scss';
export interface PayContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const PayContent: React.FC<PayContentProps> = (props) => {
  return (
    <CustomDrawerContent
      title="支持作者"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <div>
          <div className={styles.title}>
            <AliPayIcon />
            <span>支付宝支持一下~</span>
          </div>
          <div className={styles.pay}>
            <Tilt
              options={{ max: 20 }}
              className={classnames(styles.qrcode, styles.alipay)}
            >
              <img src={alipayQRcodeImage} />
            </Tilt>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <WechatPayIcon />
            <span>微信支持一下~</span>
          </div>
          <div className={styles.pay}>
            <Tilt
              options={{ max: 20 }}
              className={classnames(styles.qrcode, styles.wechat)}
            >
              <img src={wechatQRcodeImage} />
            </Tilt>
          </div>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default PayContent;
