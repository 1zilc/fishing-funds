import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

interface HotThemeProps {}

const HotTheme: React.FC<HotThemeProps> = () => {
  return <div className={classnames(styles.content)}>HotTheme Component</div>;
};

export default HotTheme;
