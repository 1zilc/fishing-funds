import React from 'react';
import classnames from 'classnames';
import styles from './index.scss';

export interface LoadingBarProps {
  show: boolean;
}
const LoadingBar: React.FC<LoadingBarProps> = ({ show }) => {
  const text = '刷新数据中～'.split('');
  return (
    <div
      className={classnames(styles.content, {
        [styles.disable]: !show,
      })}
    >
      {text.map((_, index) => (
        <span
          key={index}
          className={styles.jump}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {_}
        </span>
      ))}
    </div>
  );
};
export default LoadingBar;
