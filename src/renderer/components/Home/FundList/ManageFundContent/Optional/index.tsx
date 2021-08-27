import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import classnames from 'classnames';

import PureCard from '@/components/Card/PureCard';
import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as MenuIcon } from '@/assets/icons/menu.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/remove.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import EditFundContent from '@/components/Home/FundList/EditFundContent';
import { deleteFundAction, setFundConfigAction } from '@/actions/fund';
import { useSyncFixFundSetting, useDrawer, useCurrentWallet } from '@/utils/hooks';

import styles from './index.scss';

export interface OptionalProps {}

const { dialog } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useDispatch();
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const { currentWalletFundsConfig: fundConfig, currentWalletFundsCodeMap: codeMap, currentWalletCode } = useCurrentWallet();

  const {
    data: editData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({
    focus: '',
    fundData: {
      cyfe: 0,
      code: '',
      name: '',
      cbj: undefined as number | undefined,
    },
  });

  const sortFundConfig = useMemo(() => fundConfig.map((_) => ({ ..._, id: _.code })), [fundConfig]);

  const { done: syncFundSettingDone } = useSyncFixFundSetting();

  function onSortFundConfig(sortList: Fund.SettingItem[]) {
    const fundConfig = sortList.map((item) => {
      const fund = codeMap[item.code];
      return {
        name: fund.name,
        cyfe: fund.cyfe,
        code: fund.code,
        cbj: fund.cbj,
      };
    });
    dispatch(setFundConfigAction(fundConfig, currentWalletCode));
  }

  async function onRemoveFund(fund: Fund.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '删除基金',
      type: 'info',
      message: `确认删除 ${fund.name || ''} ${fund.code}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(deleteFundAction(fund.code));
    }
  }

  return (
    <div className={styles.content}>
      {sortFundConfig.length ? (
        syncFundSettingDone ? (
          <ReactSortable animation={200} delay={2} list={sortFundConfig} setList={onSortFundConfig} dragClass={styles.dragItem} swap>
            {sortFundConfig.map((fund) => {
              return (
                <PureCard key={fund.code} className={classnames(styles.row, 'hoverable')}>
                  <RemoveIcon
                    className={styles.remove}
                    onClick={(e) => {
                      onRemoveFund(fund);
                      e.stopPropagation();
                    }}
                  />
                  <div className={styles.inner}>
                    <div className={styles.name}>
                      {fund.name}
                      <span className={styles.code}>（{fund.code}）</span>
                    </div>
                    <div>
                      <span className={styles.cyfe}>
                        持有份额：{fund.cyfe.toFixed(2)}
                        <EditIcon
                          className={styles.editor}
                          onClick={() => {
                            setEditDrawer({
                              fundData: {
                                name: fund.name,
                                cyfe: fund.cyfe,
                                code: fund.code,
                                cbj: fund.cbj,
                              },
                              focus: 'cyfe',
                            });
                          }}
                        />
                      </span>
                      <span className={styles.cbj}>
                        成本价：
                        {fund.cbj !== undefined ? (
                          <span>{fund.cbj}</span>
                        ) : (
                          <a
                            onClick={() => {
                              setEditDrawer({
                                fundData: {
                                  name: fund.name,
                                  cyfe: fund.cyfe,
                                  code: fund.code,
                                  cbj: fund.cbj,
                                },
                                focus: 'cbj',
                              });
                            }}
                          >
                            录入
                          </a>
                        )}
                      </span>
                    </div>
                  </div>
                  <MenuIcon className={styles.menu} />
                </PureCard>
              );
            })}
          </ReactSortable>
        ) : (
          <Empty text="正在同步基金设置~" />
        )
      ) : (
        <Empty text="暂未自选基金~" />
      )}
      <div
        className={styles.add}
        onClick={(e) => {
          setAddDrawer(null);
          e.stopPropagation();
        }}
      >
        <AddIcon />
      </div>
      <CustomDrawer show={showAddDrawer}>
        <AddFundContent onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showEditDrawer}>
        <EditFundContent onClose={closeEditDrawer} onEnter={closeEditDrawer} fund={editData.fundData} focus={editData.focus} />
      </CustomDrawer>
    </div>
  );
};

export default Optional;
