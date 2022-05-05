import React, { useState } from 'react';
import { Row, Col } from 'antd';
import clsx from 'clsx';

import styles from './index.module.scss';

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
  colspan?: number;
  flex?: boolean;
}

const TypeSelection: React.FC<TypeSelectionProps> = ({
  activeType,
  types = [],
  style = {},
  onSelected,
  colspan = Math.ceil(24 / types.length),
  flex,
}) => {
  return (
    <div className={styles.selections} style={style}>
      <Row gutter={[10, 10]}>
        {types.map((item) => (
          <Col key={item.type} span={colspan} flex={flex ? colspan : undefined} style={{ textAlign: 'center' }}>
            <span
              className={clsx(styles.selection, {
                [styles.active]: activeType === item.type,
              })}
              onClick={() => onSelected(item)}
            >
              {item.name}
            </span>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TypeSelection;
