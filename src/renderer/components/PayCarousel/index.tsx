import React from 'react';
import classnames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types/swiper-options';
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from 'swiper';

import StandCard from '@/components/Card/StandCard';
import wechatQRcodeImage from '@/static/qrcode/wechat.png';
import alipayQRcodeImage from '@/static/qrcode/alipay.png';
import WechatPayIcon from '@/static/icon/wechat-pay.svg';
import AliPayIcon from '@/static/icon/alipay.svg';

import styles from './index.module.scss';

export interface PayCarouselProps {}

SwiperCore.use([Autoplay, EffectCoverflow, Pagination]);

const config: SwiperOptions = {
  effect: 'coverflow',
  slidesPerView: 1,
  speed: 500,
  centeredSlides: true,
  autoplay: { delay: 3000 },
  pagination: {
    clickable: true,
  },
  coverflowEffect: {
    rotate: 30,
    depth: 80,
    modifier: 2,
    slideShadows: false,
  },
  loop: true,
};

const PayCarousel: React.FC<PayCarouselProps> = () => {
  return (
    <div className={styles.content}>
      <Swiper {...config} style={{ padding: '0 10px 20px' }}>
        <SwiperSlide>
          <StandCard icon={<AliPayIcon className={styles.alipay} />} title="支付宝">
            <div className={classnames(styles.pay, 'card-body')}>
              <img src={alipayQRcodeImage} />
            </div>
          </StandCard>
        </SwiperSlide>
        <SwiperSlide>
          <StandCard icon={<WechatPayIcon className={styles.wechat} />} title="微信">
            <div className={classnames(styles.pay, 'card-body')}>
              <img src={wechatQRcodeImage} />
            </div>
          </StandCard>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default PayCarousel;
