import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import classnames from 'classnames';

import PureCard from '@/components/Card/PureCard';
import { ReactComponent as AddIcon } from '@/static/icon/add.svg';
import { ReactComponent as MenuIcon } from '@/static/icon/menu.svg';
import { ReactComponent as RemoveIcon } from '@/static/icon/remove.svg';
import { ReactComponent as EditIcon } from '@/static/icon/edit.svg';
import { ReactComponent as CopyIcon } from '@/static/icon/copy.svg';
import { ReactComponent as BellsLineIcon } from '@/static/icon/bells-line.svg';
import { ReactComponent as BellsFillIcon } from '@/static/icon/bells-fill.svg';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import AddFundContent from '@/components/Home/FundList/AddFundContent';
import EditFundContent from '@/components/Home/FundList/EditFundContent';
import { deleteFundAction, setFundConfigAction, updateFundAction } from '@/actions/fund';
import { useSyncFixFundSetting, useDrawer, useCurrentWallet } from '@/utils/hooks';

import styles from './index.module.scss';

export interface OptionalProps {}

const { dialog, clipboard } = window.contextModules.electron;

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
      zdfRange: undefined as number | undefined,
    },
  });

  const sortFundConfig = useMemo(() => fundConfig.map((_) => ({ ..._, id: _.code })), [fundConfig]);

  const { done: syncFundSettingDone } = useSyncFixFundSetting();

  function onSortFundConfig(sortList: Fund.SettingItem[]) {
    const fundConfig = sortList.map((item) => {
      const fund = codeMap[item.code];
      return fund;
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

  function onCopyFund(fund: Fund.SettingItem) {
    try {
      clipboard.writeText(JSON.stringify([fund]));
      dialog.showMessageBox({
        title: `复制成功`,
        type: 'info',
        message: `已复制 ${fund.name} 配置到粘贴板`,
      });
    } catch (error) {
      dialog.showMessageBox({
        type: 'info',
        title: `复制失败`,
        message: `基金JSON复制失败`,
      });
    }
  }

  async function onCancleRiskNotice(fund: Fund.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '取消涨跌通知',
      type: 'info',
      message: `确认取消 ${fund.name || ''} 涨跌范围 ${fund.zdfRange}% 通知`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(
        updateFundAction({
          ...fund,
          zdfRange: undefined,
        })
      );
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
                  <RemoveIcon className={styles.remove} onClick={() => onRemoveFund(fund)} />
                  <div className={styles.inner}>
                    <div className={styles.name}>
                      {fund.name}
                      <span className={styles.code}>（{fund.code}）</span>
                    </div>
                  </div>
                  <EditIcon
                    className={styles.function}
                    onClick={() =>
                      setEditDrawer({
                        fundData: {
                          name: fund.name,
                          cyfe: fund.cyfe,
                          code: fund.code,
                          cbj: fund.cbj,
                          zdfRange: fund.zdfRange,
                        },
                        focus: '',
                      })
                    }
                  />
                  {fund.zdfRange ? (
                    <BellsFillIcon className={styles.function} onClick={() => onCancleRiskNotice(fund)} />
                  ) : (
                    <BellsLineIcon
                      className={styles.function}
                      onClick={() =>
                        setEditDrawer({
                          fundData: {
                            name: fund.name,
                            cyfe: fund.cyfe,
                            code: fund.code,
                            cbj: fund.cbj,
                            zdfRange: fund.zdfRange,
                          },
                          focus: 'zdfRange',
                        })
                      }
                    />
                  )}
                  <CopyIcon className={styles.function} onClick={() => onCopyFund(fund)} />
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
