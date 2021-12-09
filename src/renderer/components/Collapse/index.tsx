import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';

import classnames from 'classnames';
import styles from './index.module.scss';

interface CollapseProps {
  isOpened?: boolean;
  style?: React.CSSProperties;
}

const Collapse: React.FC<PropsWithChildren<CollapseProps>> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(contentRef.current?.clientHeight);

  useLayoutEffect(() => {
    setMax(contentRef.current?.clientHeight);
  }, [contentRef.current?.clientHeight]);

  return (
    <div
      className={classnames(styles.content)}
      style={{
        maxHeight: props.isOpened ? max : 0,
        ...props.style,
      }}
    >
      <div ref={contentRef}>{props.children}</div>
    </div>
  );
};

export default Collapse;
