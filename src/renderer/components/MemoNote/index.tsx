import React from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface MemoNoteProps {
  text?: string;
}

const MemoNote: React.FC<MemoNoteProps> = (props) => {
  const { text } = props;
  return <div className={clsx(styles.content)}>{text}</div>;
};

export default React.memo(MemoNote);
