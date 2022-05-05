import React from 'react';
import clsx from 'clsx';
import NationalStockTradingStatistics from '@/components/Home/ZindexView/EconomicDataContent/FinancialStatistics/NationalStockTradingStatistics';
import Revenue from '@/components/Home/ZindexView/EconomicDataContent/FinancialStatistics/Revenue';
import DepositReserveRatio from '@/components/Home/ZindexView/EconomicDataContent/FinancialStatistics/DepositReserveRatio';
import ForeignExchangeAndGold from '@/components/Home/ZindexView/EconomicDataContent/FinancialStatistics/ForeignExchangeAndGold';
import OilPrice from '@/components/Home/ZindexView/EconomicDataContent/FinancialStatistics/OilPrice';
import styles from './index.module.scss';

interface FinancialStatisticsProps {}

const FinancialStatistics: React.FC<FinancialStatisticsProps> = () => {
  return (
    <div className={clsx(styles.content)}>
      <Revenue />
      <NationalStockTradingStatistics />
      <ForeignExchangeAndGold />
      <OilPrice />
      <DepositReserveRatio />
    </div>
  );
};

export default FinancialStatistics;
