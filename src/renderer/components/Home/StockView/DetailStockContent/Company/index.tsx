import React, { useEffect, useState } from 'react';
import ChartCard from '@/components/Card/ChartCard';
import { useAppSelector } from '@/utils/hooks';

import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export const defaultCompany: Stock.Company = {
  gsjs: '',
  sshy: '', // 所属行业
  dsz: '', // 董事长
  zcdz: '', // 注册地址
  clrq: '', // 成立日期
  ssrq: '', // 上市日期
};
export interface CompanyProps {
  secid: string;
}

const Company: React.FC<CompanyProps> = ({ secid }) => {
  const [company, setCompany] = useState<Stock.Company>(defaultCompany);
  const codeMap = useAppSelector((state) => state.wallet.stockConfigCodeMap);
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
        <div>
          <label>董事长/法人代表：</label>
          <span>{company.dsz || '暂无~'}</span>
        </div>
        <div>
          <label>所属行业：</label>
          <span>{company.sshy || '暂无~'}</span>
        </div>
        <div>
          <label>注册地址：</label>
          <span>{company.zcdz || '暂无~'}</span>
        </div>
        <div>
          <label>成立日期：</label>
          <span>{company.clrq || '暂无~'}</span>
        </div>
        <div>
          <label>上市日期：</label>
          <span>{company.ssrq || '暂无~'}</span>
        </div>
        <div>
          <span>{company.gsjs || '暂无公司简介~'}</span>
        </div>
      </div>
    </ChartCard>
  );
};

export default Company;
