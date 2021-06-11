import React from 'react';
import classnames from 'classnames';

import { ReactComponent as EyeIcon } from '@/assets/icons/eye.svg';
import { ReactComponent as EyeCloseIcon } from '@/assets/icons/eye-close.svg';
import styles from './index.scss';

export interface EyeProps {
  style?: Record<string, any>;
  classNames?: string;
  status: boolean;
  onClick: (status: boolean) => void;
}

const Eye: React.FC<EyeProps> = (props) => {
  const { status, style, classNames = '' } = props;
  function toggle() {
    if (props.onClick) {
      props.onClick(!status);
    }
  }
  return (
    <>
      {status ? (
        <EyeIcon
          className={classnames(styles.eye, classNames)}
          style={style}
          onClick={toggle}
        />
      ) : (
        <EyeCloseIcon style={style} onClick={toggle} />
      )}
    </>
  );
};
export default Eye;
