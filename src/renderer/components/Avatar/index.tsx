import React from 'react';
import clsx from 'clsx';
import colorHash from '@/utils/colorHash';
import styles from './index.module.css';

interface AvatarProps {
  url?: string;
  name?: string;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const { url, name } = props;
  const color = colorHash.hex(name || 'ff');
  return (
    <div
      className={clsx(styles.content)}
      style={{
        backgroundColor: color,
      }}
    >
      {url ? <img /> : <span>{name?.slice(0, 1)}</span>}
    </div>
  );
};

export default Avatar;
