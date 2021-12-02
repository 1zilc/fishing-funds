import React from 'react';
import { Tooltip, Button } from 'antd';
import { useHomeContext } from '@/components/Home';
import QuestionIcon from '@/static/icon/question.svg';
import styles from './index.module.scss';

export interface GuideProps {
  list: { name: string; text: string }[];
}

const iconSize = { height: 16, width: 16 };

const Guide: React.FC<GuideProps> = (props) => {
  const { list } = props;
  const { varibleColors, darkMode } = useHomeContext();

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
      overlayClassName={styles.content}
      color={varibleColors['--primary-color']}
    >
      <QuestionIcon {...iconSize} style={{ fill: 'var(--svg-icon-color)' }} />
    </Tooltip>
  );
};

export default Guide;
