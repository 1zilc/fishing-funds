import { PropsWithChildren } from 'react';
import { ConfigProvider, theme } from 'antd';

export interface ThemeProviderProps {
  target?: string;
  config: {
    darkMode: boolean;
    lowKey: boolean;
    baseFontSize: number;
    primaryColor: string;
  };
}
export type StylesProps = ThemeProviderProps;

const { platform } = window.contextModules.process;

const Styles: React.FC<StylesProps> = (props) => {
  const { useToken } = theme;
  const { config, target } = props;
  const { token } = useToken();

  return (
    <style>
      {` ${target || ':root'} {
            filter: ${config.lowKey && 'grayscale(90%)'};
            font-size: ${config.baseFontSize}px;
            background-color: ${platform === 'darwin' ? 'initial' : 'var(--inner-color)'};

            --alipay-color: #156dff;
            --wechat-color: #1fa131;
            --base-font-size: ${token.fontSize}px;
            --primary-color: ${config.primaryColor};
            --hover-color: ${token.colorPrimaryBg};
            --selected-color: ${token.colorPrimaryBgHover};
            --background-color: ${token.colorBgContainer};
            --inner-color: ${token.colorBgLayout};
            --inner-text-color: ${token.colorTextTertiary};
            --main-text-color: ${token.colorText};
            --secondary-main-text-color: ${token.colorTextTertiary};
            --increase-color: ${token.colorError};
            --increase-bg-color: ${token.colorErrorBg};
            --reduce-color: ${token.colorSuccess};
            --reduce-bg-color: ${token.colorSuccessBg};
            --warn-color: ${token.colorWarning};
            --warn-bg-color: ${token.colorWarningBg};
            --tag-text-color: ${token.colorTextLightSolid};
            --svg-icon-color: ${token.colorTextSecondary};
            --border-color: ${token.colorFillQuaternary};
            --cancel-color: ${token.colorFillSecondary};
            --cancel-text-color: ${token.colorTextSecondary};
            --reverse-text-color: #888;
            --blur-color: ${config.darkMode ? 'rgba(29, 29, 31, 0.72)' : 'rgba(255, 255, 255, 0.72)'};
            --origin-primary-color: ${config.darkMode ? '#1677ff' : '#3086ff'};
      }`}
    </style>
  );
};

const ThemeProvider: React.FC<PropsWithChildren<ThemeProviderProps>> = (props) => {
  const { config, target } = props;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: config.primaryColor,
          fontSizeBase: config.baseFontSize,
          colorSuccess: '#00b578',
          colorWarning: '#ff8f1f',
          colorError: '#ff3141',
        },
        algorithm: config.darkMode ? [theme.darkAlgorithm] : [],
      }}
      autoInsertSpaceInButton={false}
    >
      <Styles config={config} target={target} />
      {props.children}
    </ConfigProvider>
  );
};
export default ThemeProvider;
