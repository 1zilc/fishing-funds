import React from 'react';
import classnames from 'classnames';
import Tilt from 'react-tilt';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import wechatQRcodeImage from '@/assets/qrcode/wechat.png';
import alipayQRcodeImage from '@/assets/qrcode/alipay.png';
import { ReactComponent as CoinIcon } from '@/assets/icons/coin.svg';
import { ReactComponent as WechatPayIcon } from '@/assets/icons/wechat-pay.svg';
import { ReactComponent as AliPayIcon } from '@/assets/icons/alipay.svg';

import styles from './index.scss';
export interface PayContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const iconSize = {
  height: 48,
  width: 48,
};
const PayContent: React.FC<PayContentProps> = (props) => {
  return (
    <CustomDrawerContent
      title="支持作者"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <div className={classnames(styles.coin)}>
          <CoinIcon {...iconSize} />
          <div className={styles.describe}>
            ❤️ Fishing Funds
            是一款个人开发小软件，开源后深受大家的喜爱，接受了大量宝贵的改进建议，有些功能连作者自己都很少用到，但还是感谢大家的反馈，作者利用空闲时间开发不易，您的支持可以给本项目的开发和完善提供巨大的动力，感谢对本软件的喜爱和认可
            :)
          </div>
        </div>
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
