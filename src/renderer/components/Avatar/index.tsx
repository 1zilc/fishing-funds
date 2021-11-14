import React, { useMemo } from 'react';
import ColorHash from 'color-hash';
import classnames from 'classnames';
import styles from './index.module.scss';

interface AvatarProps {
  url?: string;
  name?: string;
}

const colorHash = new ColorHash();

const Avatar: React.FC<AvatarProps> = (props) => {
  const { url, name } = props;
  const color = useMemo(() => colorHash.hex(name || 'ff'), [name]);
  return (
    <div
      className={classnames(styles.content)}
      style={{
        backgroundColor: color,
        boxShadow: `0 2px 5px ${color}`,
      }}
    >
      {url ? <img /> : <span>{name?.slice(0, 1)}</span>}
    </div>
  );
};

export default Avatar;
