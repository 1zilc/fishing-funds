import React from 'react';
import classnames from 'classnames';
import ConsumerPriceIndex from '@/components/Home/ZindexList/ManageZindexContent/Economy/ConsumerPriceIndex';
import ProducerPriceIndex from '@/components/Home/ZindexList/ManageZindexContent/Economy/ProducerPriceIndex';
import GrossDomesticProduct from '@/components/Home/ZindexList/ManageZindexContent/Economy/GrossDomesticProduct';
import PurchasingManagerIndex from '@/components/Home/ZindexList/ManageZindexContent/Economy/PurchasingManagerIndex';
import ConsumerConfidenceIndex from '@/components/Home/ZindexList/ManageZindexContent/Economy/ConsumerConfidenceIndex';
import styles from './index.module.scss';

interface EconomyProps {}

const Economy: React.FC<EconomyProps> = () => {
  return (
    <div className={classnames(styles.content)}>
      <ConsumerPriceIndex />
      <ProducerPriceIndex />
      <GrossDomesticProduct />
      <PurchasingManagerIndex />
      <ConsumerConfidenceIndex />
    </div>
  );
};

export default Economy;
