import React from 'react';
import classsames from 'classnames';
import { Dropdown, Menu } from 'antd';
import { ReactComponent as SortArrowUpIcon } from '../../assets/icons/sort-arrow-up.svg';
import { ReactComponent as SortArrowDownIcon } from '../../assets/icons/sort-arrow-down.svg';
import {
  getSortMode,
  setSortMode,
  getSortConfig,
  troggleSortOrder,
} from '../../actions/sort';
import * as Enums from '../../utils/enums';
import styles from './index.scss';

export interface SortBarProps {
  onSort: () => void;
}

const SortBar: React.FC<SortBarProps> = ({ onSort }) => {
  const { type, order } = getSortMode();
  const { sortModeOptions, sortModeOptionsMap } = getSortConfig();

  return (
    <div className={styles.content}>
      <div className={styles.bar}>
        <div className={styles.name}>基金名称</div>
        <div className={styles.mode}>
          <Dropdown
            placement="bottomRight"
            // trigger={['click']}
            overlay={
              <Menu>
                {sortModeOptions.map(({ key, value }) => (
                  <Menu.Item
                    key={key}
                    onClick={() => {
                      setSortMode({
                        type: key,
                      });
                      onSort();
                    }}
                  >
                    {value}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              // onClick={(e) => e.preventDefault()}
            >
              {sortModeOptionsMap[type].value}
            </a>
          </Dropdown>
        </div>
        <div
          className={styles.sort}
          onClick={() => {
            troggleSortOrder();
            onSort();
          }}
        >
          <SortArrowUpIcon
            className={classsames({
              [styles.selectOrder]: order === Enums.SortOrderType.Asc,
            })}
          />
          <SortArrowDownIcon
            className={classsames({
              [styles.selectOrder]: order === Enums.SortOrderType.Desc,
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default SortBar;
