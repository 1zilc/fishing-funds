import React from 'react';
import classnames from 'classnames';
import NationalStockTradingStatistics from '@/components/Home/ZindexList/ManageZindexContent/FinancialStatistics/NationalStockTradingStatistics';
import Revenue from '@/components/Home/ZindexList/ManageZindexContent/FinancialStatistics/Revenue';
import DepositReserveRatio from '@/components/Home/ZindexList/ManageZindexContent/FinancialStatistics/DepositReserveRatio';
import ForeignExchangeAndGold from '@/components/Home/ZindexList/ManageZindexContent/FinancialStatistics/ForeignExchangeAndGold';
import OilPrice from '@/components/Home/ZindexList/ManageZindexContent/FinancialStatistics/OilPrice';
import styles from './index.module.scss';

interface FinancialStatisticsProps {}

const FinancialStatistics: React.FC<FinancialStatisticsProps> = () => {
  return (
    <div className={classnames(styles.content)}>
      <Revenue />
      <NationalStockTradingStatistics />
      <ForeignExchangeAndGold />
      <OilPrice />
      <DepositReserveRatio />
    </div>
  );
};

export default FinancialStatistics;
