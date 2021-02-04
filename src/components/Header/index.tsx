import React, { PropsWithChildren, createContext } from 'react';
import { useScroll } from 'ahooks';
import classnames from 'classnames';
import styles from './index.scss';

export interface HeaderContextType {
  miniMode: boolean;
}

export const HeaderContext = createContext<HeaderContextType>({
  miniMode: false,
});

const Header: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const position = useScroll(document, (val) => val.top <= 400);
  const miniMode = position.top > 40;
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
          {children}
        </div>
      </div>
    </HeaderContext.Provider>
  );
};
export default Header;
