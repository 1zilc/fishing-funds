import React from 'react';
import { RiArrowDownSFill, RiArrowUpSFill, RiSubtractLine } from 'react-icons/ri';

export interface ArrowLineProps {
  value?: string | number;
}
const ArrowLine: React.FC<ArrowLineProps> = React.memo(({ value }) =>
  Number(value) > 0 ? (
    <RiArrowUpSFill className="svg-up" />
  ) : Number(value) ? (
    <RiArrowDownSFill className="svg-down" />
  ) : (
    <RiSubtractLine className="svg-none" />
  )
);

export default ArrowLine;
