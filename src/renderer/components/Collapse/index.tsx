import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import styles from './index.module.scss';

interface CollapseProps {
  isOpened?: boolean;
  style?: React.CSSProperties;
}

const Collapse: React.FC<PropsWithChildren<CollapseProps>> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={clsx(styles.content)}
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
