import React, { useCallback } from 'react';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { useBoolean, useThrottleFn } from 'ahooks';

import RefreshIcon from '@/static/icon/refresh.svg';
import SettingIcon from '@/static/icon/setting.svg';
import AppsIcon from '@/static/icon/apps.svg';
import CustomDrawer from '@/components/CustomDrawer';
import SettingContent from '@/components/Toolbar/SettingContent';
import AppCenterContent from '@/components/Toolbar/AppCenterContent';
import { StoreState } from '@/reducers/types';
import { useScrollToTop, useFreshFunds } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };

const ToolBar: React.FC<ToolBarProps> = () => {
  const updateInfo = useSelector((state: StoreState) => state.updater.updateInfo);
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

  const { run: runLoadZindexs } = useThrottleFn(Helpers.Zindex.LoadZindexs, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadQuotations } = useThrottleFn(Helpers.Quotation.LoadQuotations, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadStocks } = useThrottleFn(Helpers.Stock.LoadStocks, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadCoins } = useThrottleFn(Helpers.Coin.LoadCoins, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshZindexs = useScrollToTop({ after: () => runLoadZindexs(true) });
  const freshQuotations = useScrollToTop({ after: () => runLoadQuotations(true) });
  const freshStocks = useScrollToTop({ after: () => runLoadStocks(true) });
  const freshCoins = useScrollToTop({ after: () => runLoadCoins(true) });

  const [showSettingDrawer, { setTrue: openSettingDrawer, setFalse: closeSettingDrawer, toggle: ToggleSettingDrawer }] = useBoolean(false);
  const [showAppCenterDrawer, { setTrue: openAppCenterDrawer, setFalse: closeAppCenterDrawer, toggle: ToggleAppCenterDrawer }] =
    useBoolean(false);

  const fresh = useCallback(() => {
    switch (tabsActiveKey) {
      case Enums.TabKeyType.Funds:
        freshFunds();
        break;
      case Enums.TabKeyType.Zindex:
        freshZindexs();
        break;
      case Enums.TabKeyType.Quotation:
        freshQuotations();
        break;
      case Enums.TabKeyType.Stock:
        freshStocks();
        break;
      case Enums.TabKeyType.Coin:
        freshCoins();
        break;
      default:
        break;
    }
  }, [tabsActiveKey]);

  const freshAll = useCallback(() => {
    freshFunds();
    freshZindexs();
    freshQuotations();
    freshStocks();
    freshCoins();
  }, []);

  return (
    <>
      <div className={styles.bar}>
        <AppsIcon style={{ ...iconSize }} onClick={openAppCenterDrawer} />
        <RefreshIcon style={{ ...iconSize }} onClick={fresh} />
        <Badge dot={!!updateInfo.version}>
          <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
        </Badge>
      </div>
      <CustomDrawer show={showAppCenterDrawer} cached>
        <AppCenterContent
          onClose={closeAppCenterDrawer}
          onEnter={() => {
            freshAll();
            closeAppCenterDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showSettingDrawer}>
        <SettingContent
          onClose={closeSettingDrawer}
          onEnter={() => {
            freshAll();
            closeSettingDrawer();
          }}
        />
      </CustomDrawer>
    </>
  );
};

export default ToolBar;
