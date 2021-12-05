import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

interface EconomyProps {}

const Economy: React.FC<EconomyProps> = () => {
  return <div className={classnames(styles.content)}>Economy Component</div>;
};

export default Economy;
