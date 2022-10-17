import React from 'react';
import { useAppSelector } from '@/utils/hooks';

interface GlobalStylesProps {}

const GlobalStyles: React.FC<GlobalStylesProps> = () => {
  const { lowKeySetting, baseFontSizeSetting } = useAppSelector((state) => state.setting.systemSetting);

  return (
    <>
      <style>
        {` html {
            filter: ${lowKeySetting && 'grayscale(90%)'};
            font-size: ${baseFontSizeSetting}px;
        }`}
      </style>
    </>
  );
};

export default GlobalStyles;
