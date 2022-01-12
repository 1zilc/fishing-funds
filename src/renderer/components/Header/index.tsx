import React, { PropsWithChildren, createContext, useContext } from 'react';
import { useScroll } from 'ahooks';
import classnames from 'classnames';
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
  const miniMode = !!(position && position.top > 40);

  return (
    <HeaderContext.Provider
      value={{
        miniMode,
      }}
    >
      <div className={classnames(styles.layout)}>
        <div
          className={classnames(styles.content, {
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
