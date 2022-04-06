import React, { useCallback } from 'react';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { useBoolean } from 'ahooks';

import RefreshIcon from '@/static/icon/refresh.svg';
import SettingIcon from '@/static/icon/setting.svg';
import AppsIcon from '@/static/icon/apps.svg';
import CustomDrawer from '@/components/CustomDrawer';
import { StoreState } from '@/reducers/types';
import { useFreshFunds, useFreshZindexs, useFreshQuotations, useFreshStocks, useFreshCoins } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import styles from './index.module.scss';

const AppCenterContent = React.lazy(() => import('@/components/Toolbar/AppCenterContent'));
const SettingContent = React.lazy(() => import('@/components/Toolbar/SettingContent'));

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };

const ToolBar: React.FC<ToolBarProps> = () => {
  const updateInfo = useSelector((state: StoreState) => state.updater.updateInfo);
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshZindexs = useFreshZindexs(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshQuotations = useFreshQuotations(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshStocks = useFreshStocks(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshCoins = useFreshCoins(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

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
    <div className={styles.bar}>
      <AppsIcon style={{ ...iconSize }} onClick={openAppCenterDrawer} />
      <RefreshIcon style={{ ...iconSize }} onClick={fresh} />
      <Badge dot={!!updateInfo.version}>
        <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
      </Badge>
      <CustomDrawer show={showAppCenterDrawer}>
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
    </div>
  );
};

export default ToolBar;
