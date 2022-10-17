import { PropsWithChildren } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useAppSelector } from '@/utils/hooks';

export interface ThemeProviderProps {
  config: {
    lowKey: boolean;
    baseFontSize: number;
    primaryColor: string;
  };
}
const { platform } = window.contextModules.process;

const ThemeProvider: React.FC<PropsWithChildren<ThemeProviderProps>> = (props) => {
  const config = props.config;
  const darkMode = useAppSelector((state) => state.setting.darkMode);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: config.primaryColor,
          fontSizeBase: config.baseFontSize,
        },
        algorithm: darkMode ? [theme.darkAlgorithm] : [],
      }}
    >
      <style>
        <style>{` `}</style>
        {` html {
            filter: ${config.lowKey && 'grayscale(90%)'};
            font-size: ${config.baseFontSize}px;
        }`}
        {` body {
            --primary-color: ${config.primaryColor};
            background-color: ${platform === 'darwin' ? 'initial' : 'var(--inner-color)'};
        }`}
      </style>
      {props.children}
    </ConfigProvider>
  );
};
export default ThemeProvider;
