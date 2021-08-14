import React, { useEffect, useState } from 'react';
import ChartCard from '@/components/Card/ChartCard';
import { useSelector } from 'react-redux';

import { useHomeContext } from '@/components/Home';
import { StoreState } from '@/reducers/types';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

const defaultCompany = {
  gsjs: '',
};
export interface CompanyProps {
  secid: string;
}

const Company: React.FC<CompanyProps> = ({ secid }) => {
  const [company, setCompany] = useState<Stock.Company>(defaultCompany);
  const { codeMap } = useSelector((state: StoreState) => state.stock.config);
  const stock = codeMap[secid];

  async function getCompany(type: Enums.StockMarketType) {
    let company = defaultCompany;
    switch (type) {
      case Enums.StockMarketType.AB:
        company = await Services.Stock.GetABCompany(secid);
        break;
      case Enums.StockMarketType.HK:
        company = await Services.Stock.GetHKCompany(secid);
        break;
      case Enums.StockMarketType.US:
        company = await Services.Stock.GetUSCompany(secid);
        break;
      case Enums.StockMarketType.XSB:
        company = await Services.Stock.GetXSBCompany(secid);
        break;
      default:
        break;
    }
    setCompany(company);
  }

  useEffect(() => {
    getCompany(stock?.type);
  }, []);

  return (
    <ChartCard auto onFresh={() => getCompany(stock?.type)}>
      <div className={styles.content}>
        <span>{company.gsjs || '暂无简介~'}</span>
      </div>
    </ChartCard>
  );
};

export default Company;
