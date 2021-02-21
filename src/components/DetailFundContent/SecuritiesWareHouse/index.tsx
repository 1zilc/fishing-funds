import React, { useState, useEffect } from 'react';

import styles from './index.scss';

export interface PerformanceProps {
  pingzhongdata: Fund.PingzhongData;
}

const WareHouse: React.FC<PerformanceProps> = ({ pingzhongdata }) => {
  return <div className={styles.content}></div>;
};

export default WareHouse;
