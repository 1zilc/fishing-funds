import React, { useState } from 'react';
import classnames from 'classnames';
import styles from './index.scss';

export interface TypeOption {
  name: string;
  type: any;
  code: any;
}

interface TypeSelectionProps {
  activeType: any;
  types: TypeOption[];
  style?: Record<string, any>;
  onSelected: (option: TypeOption) => void;
}

const TypeSelection: React.FC<TypeSelectionProps> = ({
  activeType,
  types = [],
  style = {},
  onSelected,
}) => {
  return (
    <div className={styles.selections} style={style}>
      {types.map((item) => (
        <div
          key={item.type}
          className={classnames(styles.selection, {
            [styles.active]: activeType === item.type,
          })}
          onClick={() => onSelected(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default TypeSelection;
