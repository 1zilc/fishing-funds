import React, { useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import clsx from 'clsx';
import { Button } from 'antd';
import {
  RiAddLine,
  RiMenuLine,
  RiIndeterminateCircleFill,
  RiEditLine,
  RiFileCopyLine,
  RiNotification2Line,
  RiNotification2Fill,
} from 'react-icons/ri';
import PureCard from '@/components/Card/PureCard';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import { deleteFundAction, setFundConfigAction, updateFundAction } from '@/store/features/fund';
import {
  useSyncFixFundSetting,
  useDrawer,
  useAutoDestroySortableRef,
  useAppDispatch,
  useAppSelector,
} from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const AddFundContent = React.lazy(() => import('@/components/Home/FundView/AddFundContent'));
const EditFundContent = React.lazy(() => import('@/components/Home/FundView/EditFundContent'));

export interface OptionalProps {}

const { dialog, clipboard } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const fundConfig = useAppSelector((state) => state.wallet.fundConfig);
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);

  const {
    data: editData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({} as Fund.SettingItem);

  const sortFundConfig = useMemo(() => fundConfig.map((_) => ({ ..._, id: _.code })), [fundConfig]);

  const { done: syncFundSettingDone } = useSyncFixFundSetting();

  function onSortFundConfig(sortList: Fund.SettingItem[]) {
    // 判断顺序是否发生变化
    const hasChanged = Utils.CheckListOrderHasChanged(fundConfig, sortList, 'code');
    if (hasChanged) {
      const sortConfig = sortList.map((item) => codeMap[item.code]);
      dispatch(setFundConfigAction({ config: sortConfig, walletCode: currentWalletCode }));
    }
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
      message: `确认取消 ${fund.name || ''} 涨跌范围、基金净值通知`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(
        updateFundAction({
          code: fund.code,
          zdfRange: undefined,
          jzNotice: undefined,
        })
      );
    }
  }

  return (
    <div className={styles.content}>
      {sortFundConfig.length ? (
        syncFundSettingDone ? (
          <ReactSortable
            ref={sortableRef}
            animation={200}
            delay={2}
            list={sortFundConfig}
            setList={onSortFundConfig}
            dragClass={styles.dragItem}
            swap
          >
            {sortFundConfig.map((fund) => (
              <PureCard key={fund.code} className={clsx(styles.row, 'hoverable')}>
                <RiIndeterminateCircleFill className={styles.remove} onClick={() => onRemoveFund(fund)} />
                <div className={styles.name}>{fund.name}</div>
                <RiEditLine className={styles.function} onClick={() => setEditDrawer(fund)} />
                {fund.zdfRange || fund.jzNotice ? (
                  <RiNotification2Fill className={styles.function} onClick={() => onCancleRiskNotice(fund)} />
                ) : (
                  <RiNotification2Line
                    className={styles.function}
                    onClick={() =>
                      setEditDrawer({
                        name: fund.name,
                        cyfe: fund.cyfe,
                        code: fund.code,
                        cbj: fund.cbj,
                        zdfRange: fund.zdfRange,
                        memo: fund.memo,
                      })
                    }
                  />
                )}
                <RiFileCopyLine className={styles.function} onClick={() => onCopyFund(fund)} />
                <RiMenuLine className={styles.function} />
              </PureCard>
            ))}
          </ReactSortable>
        ) : (
          <Empty text="正在同步基金设置~" />
        )
      ) : (
        <Empty text="暂未自选基金~" />
      )}
      <Button
        className="bottom-button"
        shape="circle"
        type="primary"
        size="large"
        icon={<RiAddLine />}
        onClick={(e) => {
          setAddDrawer(null);
          e.stopPropagation();
        }}
      />
      <CustomDrawer show={showAddDrawer}>
        <AddFundContent onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showEditDrawer}>
        <EditFundContent onClose={closeEditDrawer} onEnter={closeEditDrawer} fund={editData} />
      </CustomDrawer>
    </div>
  );
};

export default Optional;
