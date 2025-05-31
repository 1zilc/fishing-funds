import React from 'react';
import clsx from 'clsx';
import Distributed from '@/components/Home/ZindexView/EconomicDataContent/NationalTeam/Distributed';
import Trend from '@/components/Home/ZindexView/EconomicDataContent/NationalTeam/Trend';
import Details from '@/components/Home/ZindexView/EconomicDataContent/NationalTeam/Details';
import styles from './index.module.css';

interface NationalTeamProps {}

const NationalTeam: React.FC<NationalTeamProps> = () => {
  return (
    <div className={clsx(styles.content)}>
      <Distributed />
      <Trend />
      <Details />
    </div>
  );
};

export default NationalTeam;
