import React, { useState } from 'react';
import NP from 'number-precision';
import classnames from 'classnames';
import { useSelector } from 'react-redux';

import PureCard from '@/components/Card/PureCard';
import { calcWalletsFund } from '@/actions/fund';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import styles from './index.scss';

interface AssetsProps {
  funds: (Fund.ResponseItem & Fund.FixData)[];
  codes: string[];
}

const Assets: React.FC<AssetsProps> = ({ funds, codes }) => {
  const eyeStatus = useSelector((state: StoreState) => state.wallet.eyeStatus);
  const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
  // 盈利钱包数
  let winWalletCount = 0;
  // 盈利基金数
  const winFundCount = funds.filter(({ gszzl }) => Number(gszzl) > 0).length;
  // 总资产
  const { cyje, jrsygz } = funds.reduce(
    (result, fund) => {
      const { cyje, jrsygz } = calcWalletsFund(fund, codes);
      result.cyje += cyje;
      result.jrsygz += jrsygz;
      winWalletCount += jrsygz > 0 ? 1 : 0;
      return result;
    },
    { jrsygz: 0, cyje: 0 }
  );
  const gssyl = cyje ? NP.times(NP.divide(jrsygz, cyje), 100) : 0;

  const displayCyje = eyeOpen
    ? cyje.toFixed(2)
    : Utils.Encrypt(cyje.toFixed(2));
  const displaySygz = eyeOpen
    ? Utils.Yang(jrsygz.toFixed(2))
    : Utils.Encrypt(Utils.Yang(jrsygz.toFixed(2)));
  const displayGssyl = eyeOpen
    ? gssyl.toFixed(2)
    : Utils.Encrypt(gssyl.toFixed(2));
  const displayWinWalletCount = eyeOpen
    ? winWalletCount
    : Utils.Encrypt(String(winWalletCount));
  const displayWinFundCount = eyeOpen
    ? winFundCount
    : Utils.Encrypt(String(winFundCount));

  return (
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
          <div>钱包：{codes.length}个</div>
          <div>基金：{funds.length}支</div>
        </div>
        <div className={styles.row}>
          <div>盈利数：{displayWinWalletCount}</div>
          <div>盈利数：{displayWinFundCount}</div>
        </div>
        <div className={styles.row}>
          <div>
            收益：
            <span
              className={classnames({
                [Utils.GetValueColor(displaySygz).textClass]: eyeOpen,
              })}
            >
              {displaySygz}
            </span>
          </div>
          <div>
            收益率：
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
      </div>
    </PureCard>
  );
};

export default Assets;
