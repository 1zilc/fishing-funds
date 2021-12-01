import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

interface MemoNoteProps {
  text?: string;
}

const MemoNote: React.FC<MemoNoteProps> = (props) => {
  const { text } = props;
  return <div className={classnames(styles.content)}>{text}</div>;
};

export default MemoNote;
