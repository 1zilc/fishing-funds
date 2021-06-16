import React from 'react';
import { ReactComponent as ArrowDownLineIcon } from '@/assets/icons/arrow-down-line.svg';
import { ReactComponent as ArrowUpLineIcon } from '@/assets/icons/arrow-up-line.svg';
import { ReactComponent as SubtractLineIcon } from '@/assets/icons/subtract-line.svg';

export interface ArrowLineProps {
  value?: string | number;
}
const ArrowLine: React.FC<ArrowLineProps> = ({ value }) =>
  Number(value) > 0 ? (
    <ArrowUpLineIcon className="svg-up" />
  ) : Number(value) ? (
    <ArrowDownLineIcon className="svg-down" />
  ) : (
    <SubtractLineIcon className="svg-none" />
  );

export default ArrowLine;
