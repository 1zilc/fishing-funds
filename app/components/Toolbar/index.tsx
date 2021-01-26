import React from 'react';
import classnames from 'classnames';

import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { ReactComponent as FreshIcon } from 'assets/icons/fresh.svg';
import { Fund } from '../FundRow';

import styles from './index.scss';

export interface ToolBarProps {
  onFresh: () => Promise<Fund[]>;
  onDelete: () => void;
}
const ToolBar: React.FC<ToolBarProps> = props => {
  return (
    <div className={styles.bar}>
      <AddIcon style={{ height: 24, width: 24 }} />
      <DeleteIcon style={{ height: 24, width: 24 }} onClick={props.onDelete} />
      <FreshIcon style={{ height: 24, width: 24 }} onClick={props.onFresh} />
      <SettingIcon style={{ height: 24, width: 24 }} />
    </div>
  );
};
export default ToolBar;
