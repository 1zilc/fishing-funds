import React from 'react';
import { useAppSelector, useThemeColor } from '@/utils/hooks';
import * as Enums from '@/utils/enums';

interface GlobalStylesProps {}

const GlobalStyles: React.FC<GlobalStylesProps> = () => {
  const { lowKeySetting, baseFontSizeSetting } = useAppSelector((state) => state.setting.systemSetting);
  const { customThemeColorEnable, customThemeColorSetting } = useThemeColor();

  return (
    <>
      <style>
        {` html {
            filter: ${lowKeySetting && 'grayscale(90%)'};
            font-size: ${baseFontSizeSetting}px;
        }`}
      </style>
      {customThemeColorEnable && (
        <style>
          {` body {
            --primary-color: ${customThemeColorSetting};
        }`}
        </style>
      )}
    </>
  );
};

export default GlobalStyles;
