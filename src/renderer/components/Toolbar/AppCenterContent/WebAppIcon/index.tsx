import React, { useMemo } from 'react';
import { useBoolean } from 'ahooks';
import colorHash from '@/utils/colorHash';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

interface WebAppIconProps {
  title: string;
  iconType?: Enums.WebIconType;
  favicon?: string;
  svg?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const WebAppIcon: React.FC<WebAppIconProps> = (props) => {
  const { iconType, title, favicon } = props;
  const [success, { setFalse }] = useBoolean(true);

  const icon = useMemo(() => {
    const color = props.color || colorHash.hex(title);

    switch (iconType) {
      case Enums.WebIconType.First:
        return (
          <div
            className={styles.app}
            style={{
              background: color,
              boxShadow: `0 2px 5px ${color}`,
            }}
            onClick={props.onClick}
          >
            <i>{title.slice(0, 1)}</i>
          </div>
        );
      case Enums.WebIconType.Favicon:
        return success ? (
          <img src={favicon} onClick={props.onClick} onError={setFalse} />
        ) : (
          <div
            className={styles.app}
            style={{
              background: 'var(--cancel-color)',
            }}
            onClick={props.onClick}
          ></div>
        );
      case Enums.WebIconType.Svg:
        return (
          <div
            className={styles.app}
            style={{
              background: color,
              boxShadow: `0 2px 5px ${color}`,
            }}
            onClick={props.onClick}
          >
            {props.svg}
          </div>
        );
    }
  }, [iconType, title, favicon, success]);

  return (
    <div className={styles.content}>
      {icon}
      <div className={styles.name}>{title}</div>
    </div>
  );
};

export default WebAppIcon;
