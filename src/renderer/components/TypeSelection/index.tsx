import React, { useState } from 'react';
import { Row, Col } from 'antd';
import classnames from 'classnames';

import { useHomeContext } from '@/components/Home';
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
  const { varibleColors } = useHomeContext();
  const padding = varibleColors['--base-padding'];
  return (
    <div className={styles.selections} style={style}>
      <Row gutter={[padding, padding]}>
        {types.map((item) => (
          <Col key={item.type} span={colspan} flex={flex ? colspan : undefined} style={{ textAlign: 'center' }}>
            <span
              className={classnames(styles.selection, {
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
