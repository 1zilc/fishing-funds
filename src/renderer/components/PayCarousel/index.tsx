import React from 'react';
import { Carousel } from 'antd';
import clsx from 'clsx';
import { RiAlipayFill, RiWechatFill } from 'react-icons/ri';
import StandCard from '@/components/Card/StandCard';

import styles from './index.module.scss';

export interface PayCarouselProps {}

const PayCarousel: React.FC<PayCarouselProps> = () => {
  return (
    <div className={styles.content}>
      <Carousel autoplay>
        <StandCard icon={<RiAlipayFill className={styles.alipay} />} title="支付宝">
          <div className={clsx(styles.pay, 'card-body')}>
            <img src="qrcode/alipay.png" />
          </div>
        </StandCard>
        <StandCard icon={<RiWechatFill className={styles.wechat} />} title="微信">
          <div className={clsx(styles.pay, 'card-body')}>
            <img src="qrcode/wechat.png" />
          </div>
        </StandCard>
      </Carousel>
    </div>
  );
};

export default PayCarousel;
