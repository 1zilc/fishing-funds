import React, { useState } from 'react';
import NP from 'number-precision';
import classnames from 'classnames';
import { useSelector } from 'react-redux';

import PureCard from '@/components/Card/PureCard';
import Score from '@/components/Home/FundList/FundStatisticsContent/AssetsStatistics/Score';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface AssetsStatisticsProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const AssetsStatistics: React.FC<AssetsStatisticsProps> = ({ funds, codes }) => {
  const eyeStatus = useSelector((state: StoreState) => state.wallet.eyeStatus);
  const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
  // 盈利钱包数
  const winWalletCount = codes.reduce((result, code) => {
    const funds = Helpers.Wallet.GetWalletState(code).funds || [];
    const { sygz } = Helpers.Fund.CalcFunds(funds, code);
    return result + (sygz > 0 ? 1 : 0);
  }, 0);
  // 盈利基金数
  const winFundCount = funds.filter(({ gszzl }) => Number(gszzl) > 0).length;
  // 总资产
  const { cyje, jrsygz, cysy, cbje } = funds.reduce(
    (result, fund) => {
      const { cyje, jrsygz, cysy, cbje } = Helpers.Fund.CalcWalletsFund(fund, codes);
      result.cyje += cyje;
      result.jrsygz += jrsygz;
      result.cysy += cysy;
      result.cbje += cbje;
      return result;
    },
    { jrsygz: 0, cyje: 0, cysy: 0, cbje: 0 }
  );
  const gssyl = cyje ? NP.times(NP.divide(jrsygz, cyje), 100) : 0;
  const cysyl = cbje ? NP.times(NP.divide(cysy, cbje), 100) : 0;

  const displayCyje = eyeOpen ? cyje.toFixed(2) : Utils.Encrypt(cyje.toFixed(2));
  const displaySygz = eyeOpen ? Utils.Yang(jrsygz.toFixed(2)) : Utils.Encrypt(Utils.Yang(jrsygz.toFixed(2)));
  const displayGssyl = eyeOpen ? gssyl.toFixed(2) : Utils.Encrypt(gssyl.toFixed(2));
  const displayWinWalletCount = eyeOpen ? winWalletCount : Utils.Encrypt(String(winWalletCount));
  const displayWinFundCount = eyeOpen ? winFundCount : Utils.Encrypt(String(winFundCount));
  const displayCodesLength = eyeOpen ? codes.length : Utils.Encrypt(String(codes.length));
  const displayFundsLength = eyeOpen ? funds.length : Utils.Encrypt(String(funds.length));
  const displayCysy = eyeOpen ? Utils.Yang(cysy.toFixed(2)) : Utils.Encrypt(Utils.Yang(cysy.toFixed(2)));
  const displayCysyl = eyeOpen ? cysyl.toFixed(2) : Utils.Encrypt(cysyl.toFixed(2));

  return (
    <>
      <PureCard className={styles.content}>
        <div style={{ textAlign: 'center' }}>
          <div>总资产</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
              lineHeight: '24px',
              marginBottom: 10,
            }}
          >
            {eyeOpen ? '￥' : ''}
            {displayCyje}
          </div>
          <div className={styles.row}>
            <div>
              钱包：{displayCodesLength}
              {eyeOpen ? '个' : ''}
            </div>
            <div>
              基金：{displayFundsLength}
              {eyeOpen ? '支' : ''}
            </div>
          </div>
          <div className={styles.row}>
            <div>盈利数：{displayWinWalletCount}</div>
            <div>正增幅：{displayWinFundCount}</div>
          </div>
          <div className={styles.row}>
            <div>
              收益(今)：
              <span
                className={classnames({
                  [Utils.GetValueColor(displaySygz).textClass]: eyeOpen,
                })}
              >
                {displaySygz}
              </span>
            </div>
            <div>
              收益率(今)：
              <span
                className={classnames({
                  [Utils.GetValueColor(displayGssyl).textClass]: eyeOpen,
                })}
              >
                {displayGssyl}
                {eyeOpen ? '%' : ''}
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              持有收益：
              <span
                className={classnames({
                  [Utils.GetValueColor(displayCysy).textClass]: eyeOpen,
                })}
              >
                {displayCysy}
              </span>
            </div>
            <div>
              持有收益率：
              <span
                className={classnames({
                  [Utils.GetValueColor(displayCysyl).textClass]: eyeOpen,
                })}
              >
                {displayCysyl}
                {eyeOpen ? '%' : ''}
              </span>
            </div>
          </div>
        </div>
      </PureCard>
      <Score gssyl={gssyl} />
    </>
  );
};

export default AssetsStatistics;
