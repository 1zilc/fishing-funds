import React from 'react';
import { Tooltip } from 'antd';
import { RiQuestionLine } from 'react-icons/ri';
import styles from './index.module.scss';

export interface GuideProps {
  list: { name: string; text: string }[];
}

const iconSize = { height: 16, width: 16 };

const Guide: React.FC<GuideProps> = (props) => {
  const { list } = props;

  return (
    <Tooltip
      placement="bottomRight"
      title={
        <div>
          {list.map((item, i) => (
            <div key={i} className={styles.item}>
              {item.name && <div className={styles.name}>{item.name}：</div>}
              <div className={styles.text}>{item.text}</div>
            </div>
          ))}
        </div>
      }
      classNames={{ root: styles.content }}
      color="var(--primary-color)"
    >
      <RiQuestionLine {...iconSize} style={{ fill: 'var(--svg-icon-color)' }} />
    </Tooltip>
  );
};

export default Guide;
