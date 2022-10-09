import React from 'react';
import clsx from 'clsx';

import EyeIcon from '@/static/icon/eye.svg';
import EyeCloseIcon from '@/static/icon/eye-close.svg';
import styles from './index.module.scss';

export interface EyeProps {
  style?: Record<string, any>;
  classNames?: string;
  status: boolean;
  onClick: (status: boolean) => void;
}

const Eye: React.FC<EyeProps> = (props) => {
  const { status, style, classNames = '' } = props;
  function toggle() {
    props.onClick?.(!status);
  }
  return status ? (
    <EyeIcon className={clsx(styles.eye, classNames)} style={style} onClick={toggle} />
  ) : (
    <EyeCloseIcon className={clsx(styles.eye, classNames)} style={style} onClick={toggle} />
  );
};
export default Eye;
