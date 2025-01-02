import { PropsWithChildren } from 'react';
import { ConfigProvider, theme } from 'antd';

export interface ThemeProviderProps {
  target?: string;
  config: {
    darkMode: boolean;
    lowKey: boolean;
    lowKeyDegree: number;
    baseFontSize: number;
    primaryColor: string;
  };
}
export type StylesProps = ThemeProviderProps;

const { useToken } = theme;
const baseAlgorithm: any[] = [];

const Styles: React.FC<StylesProps> = (props) => {
  const { config, target } = props;
  const { token } = useToken();

  return (
    <style>
      {` ${target || ':root'} {
            filter: ${config.lowKey && `grayscale(${config.lowKeyDegree}%)`};
            font-size: ${token.fontSize}px;
            font-family: ${token.fontFamily};
            --base-padding: ${token.paddingSM}px;
            --base-radius: ${token.borderRadiusLG}px;
            --base-font-size: ${token.fontSize}px;

            --primary-color: ${token.colorPrimary};
            --hover-color: ${token.colorPrimaryBg};
            --selected-color: ${token.colorPrimaryBgHover};
            --background-color: ${token.colorBgContainer};
            --inner-color: ${token.colorBgLayout};
            --inner-text-color: ${token.colorTextTertiary};
            --main-text-color: ${token.colorText};
            --secondary-main-text-color: ${token.colorTextTertiary};
            --increase-color: ${token.colorErrorText};
            --increase-bg-color: ${token.colorErrorBg};
            --reduce-color: ${token.colorSuccessText};
            --reduce-bg-color: ${token.colorSuccessBg};
            --warn-color: ${token.colorWarningText};
            --warn-bg-color: ${token.colorWarningBg};
            --tag-text-color: ${token.colorTextLightSolid};
            --svg-icon-color: ${token.colorTextSecondary};
            --border-color: ${token.colorFillQuaternary};
            --cancel-color: ${token.colorFillSecondary};
            --cancel-text-color: ${token.colorTextSecondary};

            --reverse-text-color: #888;
            --alipay-color: #156dff;
            --wechat-color: #1fa131;
            --blur-color: ${config.darkMode ? 'rgba(0,0,0,0.72)' : 'rgba(255,255,255,0.72)'};
      }`}
    </style>
  );
};

const ThemeProvider: React.FC<PropsWithChildren<ThemeProviderProps>> = (props) => {
  const { config, target } = props;

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        hashed: false,
        token: {
          colorPrimary: config.primaryColor,
          fontSize: config.baseFontSize,
          colorSuccess: '#00b578',
          colorWarning: '#ff8f1f',
          colorError: '#ff3141',
        },
        algorithm: config.darkMode ? [...baseAlgorithm, theme.darkAlgorithm] : baseAlgorithm,
      }}
      button={{ autoInsertSpace: false }}
      componentSize="small"
      space={{ size: 'small' }}
    >
      <Styles config={config} target={target} />
      {props.children}
    </ConfigProvider>
  );
};
export default ThemeProvider;
