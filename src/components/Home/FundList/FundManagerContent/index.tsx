import React, { useRef } from 'react';
import classnames from 'classnames';
import { Rate } from 'antd';
import { useScroll } from 'ahooks';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface FundManagerContentProps {
  onEnter: () => void;
  onClose: () => void;
  manager: Fund.Manager;
}

const FundManagerContent: React.FC<FundManagerContentProps> = (props) => {
  const { manager } = props;
  const ref = useRef(null);
  const position = useScroll(ref, (val) => val.top <= 400);
  const miniMode = position.top > 40;

  console.log(miniMode);
  return (
    <CustomDrawerContent
      title="基金经理"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content} ref={ref}>
        <div
          className={classnames(styles.avatarContent)}
          style={{ backgroundImage: `url(${manager.pic})` }}
        >
          <div
            className={classnames(styles.avatar, {
              [styles.avatarMiniMode]: miniMode,
            })}
          >
            <img src={manager.pic} />
          </div>
        </div>
        <div className={styles.detailContent}>
          <div className={styles.header}>
            <div className={styles.name}>{manager.name}</div>
            <Rate disabled className={styles.star} value={manager.star} />
          </div>
          <div className={styles.item}>
            <div>累计任职时间：</div>
            <div>{manager.workTime}</div>
          </div>
          <div className={styles.item}>
            <div>现任基金资产规模：</div>
            <div>{manager.fundSize}</div>
          </div>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default FundManagerContent;
