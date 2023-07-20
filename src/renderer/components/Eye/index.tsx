import React from 'react';
import clsx from 'clsx';
import { RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';
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
    <RiEyeLine className={clsx(styles.eye, classNames)} style={style} onClick={toggle} />
  ) : (
    <RiEyeCloseLine className={clsx(styles.eye, classNames)} style={style} onClick={toggle} />
  );
};
export default Eye;
