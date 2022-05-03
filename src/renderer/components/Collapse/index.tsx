import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import styles from './index.module.scss';

interface CollapseProps {
  isOpened?: boolean;
  style?: React.CSSProperties;
}

const Collapse: React.FC<PropsWithChildren<CollapseProps>> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(contentRef.current?.clientHeight);

  /**
   * 在渲染前取到最新的字组件高度，设置为collapse最大高度
   */
  useLayoutEffect(() => {
    setMaxHeight(contentRef.current?.clientHeight);
  }, [contentRef.current?.clientHeight]);

  return (
    <div
      className={clsx(styles.content)}
      style={{
        maxHeight: props.isOpened ? maxHeight : 0,
        ...props.style,
      }}
    >
      <div ref={contentRef}>{props.children}</div>
    </div>
  );
};

export default Collapse;
