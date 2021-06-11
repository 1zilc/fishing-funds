import React from 'react';
import classnames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types/swiper-options';
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from 'swiper';

import StandCard from '@/components/Card/StandCard';
import wechatQRcodeImage from '@/assets/qrcode/wechat.png';
import alipayQRcodeImage from '@/assets/qrcode/alipay.png';
import { ReactComponent as WechatPayIcon } from '@/assets/icons/wechat-pay.svg';
import { ReactComponent as AliPayIcon } from '@/assets/icons/alipay.svg';
import { ReactComponent as QQPayIcon } from '@/assets/icons/qq.svg';

import styles from './index.scss';

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
      {/* <StandCard icon={<CoinIcon />} title="软件说明">
        <div className={classnames(styles.describe, 'card-body')}>
          Fishing Funds
          是一款个人开发小软件，开源后深受大家的喜爱，接受了大量宝贵的改进建议，感谢大家的反馈，作者利用空闲时间开发不易，您的支持可以给本项目的开发和完善提供巨大的动力，感谢对本软件的喜爱和认可
          :)
        </div>
      </StandCard> */}

      <Swiper {...config} style={{ padding: '0 10px 20px' }}>
        <SwiperSlide>
          <StandCard
            icon={<AliPayIcon className={styles.alipay} />}
            title="支付宝"
          >
            <div className={classnames(styles.pay, 'card-body')}>
              <img src={alipayQRcodeImage} />
            </div>
          </StandCard>
        </SwiperSlide>
        <SwiperSlide>
          <StandCard
            icon={<WechatPayIcon className={styles.wechat} />}
            title="微信"
          >
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
