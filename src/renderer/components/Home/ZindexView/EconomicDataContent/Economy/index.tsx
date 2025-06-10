import React from 'react';
import clsx from 'clsx';
import ConsumerPriceIndex from '@/components/Home/ZindexView/EconomicDataContent/Economy/ConsumerPriceIndex';
import ProducerPriceIndex from '@/components/Home/ZindexView/EconomicDataContent/Economy/ProducerPriceIndex';
import GrossDomesticProduct from '@/components/Home/ZindexView/EconomicDataContent/Economy/GrossDomesticProduct';
import PurchasingManagerIndex from '@/components/Home/ZindexView/EconomicDataContent/Economy/PurchasingManagerIndex';
import ConsumerConfidenceIndex from '@/components/Home/ZindexView/EconomicDataContent/Economy/ConsumerConfidenceIndex';
import styles from './index.module.css';

interface EconomyProps {}

const Economy: React.FC<EconomyProps> = () => {
  return (
    <div className={clsx(styles.content)}>
      <ConsumerPriceIndex />
      <ProducerPriceIndex />
      <GrossDomesticProduct />
      <PurchasingManagerIndex />
      <ConsumerConfidenceIndex />
    </div>
  );
};

export default Economy;
