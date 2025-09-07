import React from 'react';
import { RiArrowDownLine } from 'react-icons/ri';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.css';
import clsx from 'clsx';
import StandCard from '@/components/Card/StandCard';
import { useAppSelector } from '@/utils/hooks';

export type FundsImportContentProps = {
  onEnter: () => void;
  onClose: () => void;
  funds: Partial<FundConfigItem>[];
  loading?: boolean;
};

export type FundConfigItem = {
  code: string; // 基金代码（必填）
  name: string; // 基金名称
  cyfe: number; // 持有份额
  cbj: number; // 持仓成本价
};

const FundsImportContent: React.FC<FundsImportContentProps> = (props) => {
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);

  return (
    <CustomDrawerContent
      title="基金导入"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
      enterLoading={props.loading}
    >
      <div className={styles.content}>
        {data.map((item) => {
          const localFund = codeMap[item.code];
          return (
            <StandCard key={item.code}>
              <div className={clsx('card-body')}>
                <div className={styles.nameBar}>
                  {localFund?.name || '无'}
                  <span className={clsx(styles.tag)}>本地</span>
                </div>
                {localFund && (
                  <div className={clsx(styles.infoBar)}>
                    <div>{localFund?.code}</div>
                    <div>持有份额: {localFund?.cyfe}</div>
                    <div>成本价: {localFund?.cbj}</div>
                  </div>
                )}
                <div className={clsx(styles.arrowBar)}>
                  <RiArrowDownLine />
                </div>
                <div className={styles.nameBar}>
                  {item.name}
                  <span className={clsx(styles.income)}>传入</span>
                </div>
                <div className={clsx(styles.infoBar)}>
                  <div>{item.code}</div>
                  <div>持有份额: {item?.cyfe.toFixed(2)}</div>
                  <div>成本价: {item?.cbj.toFixed(4)}</div>
                </div>
              </div>
            </StandCard>
          );
        })}
      </div>
    </CustomDrawerContent>
  );
};

export default FundsImportContent;
