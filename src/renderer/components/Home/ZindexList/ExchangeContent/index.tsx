import React from 'react';
import classnames from 'classnames';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.scss';

interface ExchangeContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ExchangeContent: React.FC<ExchangeContentProps> = (props) => {
  return (
    <CustomDrawerContent title="外汇" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}></div>
    </CustomDrawerContent>
  );
};

export default ExchangeContent;
