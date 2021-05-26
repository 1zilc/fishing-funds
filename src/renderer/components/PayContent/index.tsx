import React from 'react';
import classnames from 'classnames';

import StandCard from '@/components/Card/StandCard';
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

const PayContent: React.FC<PayContentProps> = (props) => {
  return (
    <CustomDrawerContent
      title="支持作者"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <StandCard icon={<CoinIcon />} title="软件说明">
          <div className={classnames(styles.describe, 'card-body')}>
            Fishing Funds
            是一款个人开发小软件，开源后深受大家的喜爱，接受了大量宝贵的改进建议，感谢大家的反馈，作者利用空闲时间开发不易，您的支持可以给本项目的开发和完善提供巨大的动力，感谢对本软件的喜爱和认可
            :)
          </div>
        </StandCard>
        <StandCard
          icon={<AliPayIcon className={styles.alipay} />}
          title="支付宝"
        >
          <div className={classnames(styles.pay, 'card-body')}>
            <img src={alipayQRcodeImage} />
          </div>
        </StandCard>
        <StandCard
          icon={<WechatPayIcon className={styles.wechat} />}
          title="微信"
        >
          <div className={classnames(styles.pay, 'card-body')}>
            <img src={wechatQRcodeImage} />
          </div>
        </StandCard>
      </div>
    </CustomDrawerContent>
  );
};

export default PayContent;
