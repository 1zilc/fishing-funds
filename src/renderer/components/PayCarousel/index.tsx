import React from 'react';
import { Carousel } from 'antd';
import clsx from 'clsx';

import StandCard from '@/components/Card/StandCard';
import wechatQRcodeImage from '@/static/qrcode/wechat.png';
import alipayQRcodeImage from '@/static/qrcode/alipay.png';
import WechatPayIcon from '@/static/icon/wechat-pay.svg';
import AliPayIcon from '@/static/icon/alipay.svg';

import styles from './index.module.scss';

export interface PayCarouselProps {}

const PayCarousel: React.FC<PayCarouselProps> = () => {
  return (
    <div className={styles.content}>
      <Carousel autoplay>
        <StandCard icon={<AliPayIcon className={styles.alipay} />} title="支付宝">
          <div className={clsx(styles.pay, 'card-body')}>
            <img src={alipayQRcodeImage} />
          </div>
        </StandCard>
        <StandCard icon={<WechatPayIcon className={styles.wechat} />} title="微信">
          <div className={clsx(styles.pay, 'card-body')}>
            <img src={wechatQRcodeImage} />
          </div>
        </StandCard>
      </Carousel>
    </div>
  );
};

export default PayCarousel;
