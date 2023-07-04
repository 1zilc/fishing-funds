import React from 'react';
import NP from 'number-precision';
import clsx from 'clsx';
import { useMemoizedFn } from 'ahooks';
import PureCard from '@/components/Card/PureCard';
import Score from '@/components/Home/FundView/FundStatisticsContent/AssetsStatistics/Score';
import Eye from '@/components/Eye';

import { toggleEyeStatusAction } from '@/store/features/wallet';
import { useAppDispatch, useAppSelector, useFundConfigMap } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface AssetsStatisticsProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const AssetsStatistics: React.FC<AssetsStatisticsProps> = ({ funds, codes }) => {
  const dispatch = useAppDispatch();
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const currentWallet = useAppSelector((state) => state.wallet.currentWallet);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const fundConfigMap = useFundConfigMap(codes);
  // 盈利钱包数
  const winWalletCount = codes.reduce((result, code) => {
    const { codeMap } = Helpers.Fund.GetFundConfig(code, walletsConfig);
    const { sygz } = Helpers.Fund.CalcFunds(currentWallet.funds, codeMap);
    return result + (sygz > 0 ? 1 : 0);
  }, 0);
  // 盈利基金数
  const winFundCount = funds.filter(({ gszzl }) => Number(gszzl) > 0).length;
  // 总资产
  const { cyje, jrsygz, cysy, cbje } = funds.reduce(
    (result, fund) => {
      const { cyje, jrsygz, cysy, cbje } = Helpers.Fund.CalcWalletsFund(fund, fundConfigMap);
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

  const displayCyje = eyeStatus ? cyje.toFixed(2) : Utils.Encrypt(cyje.toFixed(2));
  const displaySygz = eyeStatus ? Utils.Yang(jrsygz.toFixed(2)) : Utils.Encrypt(Utils.Yang(jrsygz.toFixed(2)));
  const displayGssyl = eyeStatus ? gssyl.toFixed(2) : Utils.Encrypt(gssyl.toFixed(2));
  const displayWinWalletCount = eyeStatus ? winWalletCount : Utils.Encrypt(String(winWalletCount));
  const displayWinFundCount = eyeStatus ? winFundCount : Utils.Encrypt(String(winFundCount));
  const displayCodesLength = eyeStatus ? codes.length : Utils.Encrypt(String(codes.length));
  const displayFundsLength = eyeStatus ? funds.length : Utils.Encrypt(String(funds.length));
  const displayCysy = eyeStatus ? Utils.Yang(cysy.toFixed(2)) : Utils.Encrypt(Utils.Yang(cysy.toFixed(2)));
  const displayCysyl = eyeStatus ? cysyl.toFixed(2) : Utils.Encrypt(cysyl.toFixed(2));

  const onToggleEye = useMemoizedFn(() => dispatch(toggleEyeStatusAction()));

  return (
    <>
      <PureCard className={styles.content}>
        <div style={{ textAlign: 'center' }}>
          <div className={styles.titleBar}>
            <span>总资产(元)</span>
            <Eye status={eyeStatus} onClick={onToggleEye} />
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
              lineHeight: '24px',
              marginBottom: 10,
            }}
          >
            {eyeStatus ? '￥' : ''}
            {displayCyje}
          </div>
          <div className={styles.row}>
            <div>
              钱包：{displayCodesLength}
              {eyeStatus ? '个' : ''}
            </div>
            <div>
              基金：{displayFundsLength}
              {eyeStatus ? '支' : ''}
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
                className={clsx({
                  [Utils.GetValueColor(displaySygz).textClass]: eyeStatus,
                })}
              >
                {displaySygz}
              </span>
            </div>
            <div>
              收益率(今)：
              <span
                className={clsx({
                  [Utils.GetValueColor(displayGssyl).textClass]: eyeStatus,
                })}
              >
                {displayGssyl}
                {eyeStatus ? '%' : ''}
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              持有收益：
              <span
                className={clsx({
                  [Utils.GetValueColor(displayCysy).textClass]: eyeStatus,
                })}
              >
                {displayCysy}
              </span>
            </div>
            <div>
              持有收益率：
              <span
                className={clsx({
                  [Utils.GetValueColor(displayCysyl).textClass]: eyeStatus,
                })}
              >
                {displayCysyl}
                {eyeStatus ? '%' : ''}
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
