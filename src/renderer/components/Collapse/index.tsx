import React, { PropsWithChildren, useRef } from 'react';

import classnames from 'classnames';
import styles from './index.scss';

interface CollapseProps {
  isOpened?: boolean;
  style?: React.CSSProperties;
}

const Collapse: React.FC<PropsWithChildren<CollapseProps>> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={classnames(styles.content)}
      style={{
        maxHeight: props.isOpened ? contentRef.current?.clientHeight : 0,
        ...props.style,
      }}
    >
      <div ref={contentRef}>{props.children}</div>
    </div>
  );
};

export default Collapse;
