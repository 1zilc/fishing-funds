import React, { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
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
    const stock = codeMap[secid];
    getCompany(stock?.type);
  }, []);

  return (
    <div className={styles.content}>
      <span>{company.gsjs || '暂无简介~'}</span>
    </div>
  );
};

export default Company;
