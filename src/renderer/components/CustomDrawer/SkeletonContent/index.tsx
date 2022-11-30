import React from 'react';
import { Skeleton } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import PureCard from '@/components/Card/PureCard';
import styles from './index.module.scss';

interface SkeletonContentProps {}

function callback() {}

const cards = new Array(6).fill('');

const SkeletonContent: React.FC<SkeletonContentProps> = () => {
  return (
    <CustomDrawerContent title="" enterText="..." onClose={callback} onEnter={callback}>
      <div className={styles.content}>
        {cards.map((_, index) => (
          <PureCard key={index} className={styles.card}>
            <Skeleton active />
          </PureCard>
        ))}
      </div>
    </CustomDrawerContent>
  );
};

export default SkeletonContent;
