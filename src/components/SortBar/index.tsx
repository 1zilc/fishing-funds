import React, { useState, useContext } from 'react';
import { useScroll, useDebounceFn } from 'ahooks';
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
import { HomeContext } from '../Home';
import * as Enums from '../../utils/enums';
import styles from './index.scss';

export interface SortBarProps {}

const SortBar: React.FC<SortBarProps> = () => {
  const { sortFunds } = useContext(HomeContext);
  const { type, order } = getSortMode();
  const { sortModeOptions, sortModeOptionsMap } = getSortConfig();
  const [visible, setVisible] = useState(true);
  const { run: debounceSetVisible } = useDebounceFn(() => setVisible(true), {
    wait: 200,
  });

  useScroll(document, () => {
    setVisible(false);
    debounceSetVisible();
    return true;
  });

  return (
    <div className={classsames(styles.content, { [styles.visible]: visible })}>
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
                      sortFunds();
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
            sortFunds();
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
