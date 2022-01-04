import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { StoreState } from '@/reducers/types';
import styles from './index.module.scss';

interface GlobalStylesProps {}

const GlobalStyles: React.FC<GlobalStylesProps> = () => {
  const { lowKeySetting, baseFontSizeSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  return (
    <>
      <style>{` html { filter: ${lowKeySetting && 'grayscale(90%)'} }`}</style>
      <style>{` html { font-size: ${baseFontSizeSetting}px }`}</style>
    </>
  );
};

export default GlobalStyles;
