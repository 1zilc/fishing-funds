import React, { PropsWithChildren, createContext, useContext, useDeferredValue } from 'react';
import { useScroll } from 'ahooks';
import clsx from 'clsx';
import styles from './index.module.scss';

export interface HeaderContextType {
  miniMode: boolean;
}

export const HeaderContext = createContext<HeaderContextType>({
  miniMode: false,
});

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  return context;
}

const Header: React.FC<PropsWithChildren<Record<string, unknown>>> = (props) => {
  const position = useScroll(document, (val) => val.top <= 520);
  const deferredTop = useDeferredValue(position?.top);
  const miniMode = !!(deferredTop && deferredTop > 40);

  return (
    <HeaderContext.Provider
      value={{
        miniMode,
      }}
    >
      <div className={clsx(styles.layout)}>
        <div
          className={clsx(styles.content, {
            [styles.miniMode]: miniMode,
          })}
        >
          {props.children}
        </div>
      </div>
    </HeaderContext.Provider>
  );
};
export default Header;
