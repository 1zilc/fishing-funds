import React from 'react';
import classnames from 'classnames';
import Distributed from '@/components/Home/ZindexList/EconomicDataContent/NationalTeam/Distributed';
import Trend from '@/components/Home/ZindexList/EconomicDataContent/NationalTeam/Trend';
import styles from './index.module.scss';

interface NationalTeamProps {}

const NationalTeam: React.FC<NationalTeamProps> = () => {
  return (
    <div className={classnames(styles.content)}>
      <Distributed />
      <Trend />
    </div>
  );
};

export default NationalTeam;
