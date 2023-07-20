import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import clsx from 'clsx';
import styles from './index.module.scss';

interface CollapseProps {
  isOpened?: boolean;
  style?: React.CSSProperties;
}

const Collapse: React.FC<PropsWithChildren<CollapseProps>> = React.memo((props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const montedRef = useRef(false);
  const [wrapStyle, setWrapStyle] = useState<React.CSSProperties>({
    height: props.isOpened ? contentRef.current?.offsetHeight : undefined,
    display: props.isOpened ? undefined : 'none',
  });

  const onTransitionEnd = useMemoizedFn(() => {
    if (props.isOpened) {
      setWrapStyle({});
    } else {
      setWrapStyle({
        display: 'none',
      });
    }
  });

  useLayoutEffect(() => {
    if (!montedRef.current) {
      montedRef.current = true;
      return;
    }
    if (props.isOpened) {
      setWrapStyle({
        height: 0,
      });
      requestAnimationFrame(() => {
        setWrapStyle({
          height: contentRef.current?.offsetHeight,
        });
      });
    } else {
      setWrapStyle({
        height: contentRef.current?.offsetHeight,
      });
      requestAnimationFrame(() => {
        setWrapStyle({
          height: 0,
        });
      });
    }
  }, [props.isOpened]);

  return (
    <div
      className={clsx(styles.content)}
      style={{
        ...wrapStyle,
        ...props.style,
      }}
      onTransitionEnd={onTransitionEnd}
    >
      <div ref={contentRef}>{props.children}</div>
    </div>
  );
});

export default Collapse;
