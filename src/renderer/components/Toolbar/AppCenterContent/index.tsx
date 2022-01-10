import React, { useState, useMemo } from 'react';
import ColorHash from 'color-hash';
import { useBoolean } from 'ahooks';
import { Input } from 'antd';

import WalletIcon from '@/static/icon/wallet.svg';
import ChartBoxIcon from '@/static/icon/chart-box.svg';
import NewsIcon from '@/static/icon/news.svg';
import ExchangeIcon from '@/static/icon/exchange.svg';
import BubbleIcon from '@/static/icon/bubble.svg';
import OrderIcon from '@/static/icon/order.svg';
import PieIcon from '@/static/icon/pie.svg';
import WeiboIcon from '@/static/icon/weibo.svg';
import NeteaseIcon from '@/static/icon/netease.svg';
import FundsIcon from '@/static/icon/funds.svg';
import TelegramIcon from '@/static/icon/telegram.svg';
import GithubIcon from '@/static/icon/github.svg';
import BilibiliIcon from '@/static/icon/bilibili.svg';
import TaobaoIcon from '@/static/icon/taobao.svg';
import YoutubeIcon from '@/static/icon/youtube.svg';

import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StandCard from '@/components/Card/StandCard';
import ManageFundContent from '@/components/Home/FundList/ManageFundContent';
import ManageWalletContent from '@/components/Wallet/ManageWalletContent';
import ManageStockContent from '@/components/Home/StockList/ManageStockContent';
import ManageCoinContent from '@/components/Home/CoinList/ManageCoinContent';
import FundStatisticsContent from '@/components/Home/FundList/FundStatisticsContent';
import ManageZindexContent from '@/components/Home/ZindexList/ManageZindexContent';
import FundFlowContent from '@/components/Home/QuotationList/FundFlowContent';
import NewsContent from '@/components/Home/NewsList/NewsContent';
import ExchangeContent from '@/components/Home/ZindexList/ExchangeContent';
import QuoteCenterContent from '@/components/Home/QuotationList/QuoteCenterContent';
import HoldingContent from '@/components/Home/QuotationList/HoldingContent';
import ViewerContent from '@/components/ViewerContent';
import { useDrawer } from '@/utils/hooks';

import styles from './index.module.scss';

const { Search } = Input;
const iconSize = { height: 18, width: 18 };
const colorHash = new ColorHash();

interface AppCenterContentProps {
  onClose: () => void;
  onEnter: () => void;
}
interface AppConfig {
  name: string;
  click: () => void;
  icon: React.ReactElement;
  color?: string;
}

function constructApps(appConfigs: AppConfig[]) {
  return (
    <div className={styles.apps}>
      {appConfigs.map((config, index) => {
        const color = config.color || colorHash.hex(config.name);
        return (
          <div className={styles.appContent} key={index}>
            <div className={styles.app} style={{ background: color, boxShadow: `0 2px 5px ${color}` }} onClick={config.click}>
              {config.icon}
            </div>
            <div className={styles.name}>{config.name}</div>
          </div>
        );
      })}
    </div>
  );
}

function renderApps(groups: { name: string; config: AppConfig[] }[], keyword: string) {
  return groups.map((group) => (
    <StandCard key={group.name} title={group.name}>
      {constructApps(group.config.filter(({ name }) => name.includes(keyword)))}
    </StandCard>
  ));
}

const AppCenterContent: React.FC<AppCenterContentProps> = (props) => {
  const [keyword, setKeyword] = useState('');
  const [showManageFundDrawer, { setTrue: openManageFundDrawer, setFalse: closeManageFundDrawer, toggle: ToggleManageFundDrawer }] =
    useBoolean(false);
  const [showManageWalletDrawer, { setTrue: openManageWalletDrawer, setFalse: closeManageWalletDrawer, toggle: ToggleManageWalletDrawer }] =
    useBoolean(false);
  const [showManageZindexDrawer, { setTrue: openManageZindexDrawer, setFalse: closeManageZindexDrawer, toggle: ToggleManageZindexDrawer }] =
    useBoolean(false);
  const [showManageStockDrawer, { setTrue: openManageStockDrawer, setFalse: closeManageStockDrawer, toggle: ToggleManageStockDrawer }] =
    useBoolean(false);
  const [showManageCoinDrawer, { setTrue: openManageCoinDrawer, setFalse: closeManageCoinDrawer, toggle: ToggleManageCoinDrawer }] =
    useBoolean(false);

  const [
    showFundsStatisticsDrawer,
    { setTrue: openFundStatisticsDrawer, setFalse: closeFundStatisticsDrawer, toggle: ToggleFundStatisticsDrawer },
  ] = useBoolean(false);

  const [showFundFlowDrawer, { setTrue: openFundFlowDrawer, setFalse: closeFundFlowDrawer, toggle: ToggleFundFlowDrawer }] =
    useBoolean(false);
  const [showNewsDrawer, { setTrue: openNewsDrawer, setFalse: closeNewsDrawer, toggle: ToggleNewsDrawer }] = useBoolean(false);
  const [showExchangeDrawer, { setTrue: openExchangeDrawer, setFalse: closeExchangeDrawer, toggle: ToggleExchangeDrawer }] =
    useBoolean(false);
  const [showQuoteCenterDrawer, { setTrue: openQuoteCenterDrawer, setFalse: closeQuoteCenterDrawer, toggle: ToggleQuoteCenterDrawer }] =
    useBoolean(false);
  const [showHoldingDrawer, { setTrue: openHoldingDrawer, setFalse: closeHoldingDrawer, toggle: ToggleHoldingDrawer }] = useBoolean(false);

  const {
    data: viewerData,
    show: showViewerDataDrawer,
    set: setViewerDataDrawer,
    close: closeViewerDataDrawer,
  } = useDrawer({ title: '', url: '', phone: false });

  const apps = useMemo(
    () =>
      renderApps(
        [
          {
            name: '数据管理',
            config: [
              {
                name: '基金管理',
                icon: <i style={{ ...iconSize }}>基</i>,
                click: openManageFundDrawer,
              },
              {
                name: '指数管理',
                icon: <i style={{ ...iconSize }}>指</i>,
                click: openManageZindexDrawer,
              },
              {
                name: '股票管理',
                icon: <i style={{ ...iconSize }}>股</i>,
                click: openManageStockDrawer,
              },
              {
                name: '货币管理',
                icon: <i style={{ ...iconSize }}>币</i>,
                click: openManageCoinDrawer,
              },
              {
                name: '钱包管理',
                icon: <WalletIcon style={{ ...iconSize }} />,
                click: openManageWalletDrawer,
              },
            ],
          },
          {
            name: '特色功能',
            config: [
              {
                name: '基金统计',
                icon: <PieIcon style={{ ...iconSize }} />,
                click: openFundStatisticsDrawer,
              },
            ],
          },
          {
            name: '拓展功能',
            config: [
              {
                name: '新闻动态',
                icon: <NewsIcon style={{ ...iconSize }} />,
                click: openNewsDrawer,
              },
              {
                name: '沪深港通股',
                icon: <OrderIcon style={{ ...iconSize }} />,
                click: openHoldingDrawer,
              },
              {
                name: '板块资金流',
                icon: <ChartBoxIcon style={{ ...iconSize }} />,
                click: openFundFlowDrawer,
              },
              {
                name: '外汇债券',
                icon: <ExchangeIcon style={{ ...iconSize }} />,
                click: openExchangeDrawer,
              },
              {
                name: '行情中心',
                icon: <BubbleIcon style={{ ...iconSize }} />,
                click: openQuoteCenterDrawer,
              },
            ],
          },
          {
            name: '摸鱼专区',
            config: [
              {
                name: '新浪微博',
                icon: <WeiboIcon style={{ ...iconSize }} />,
                color: '#F7C544',
                click: () => setViewerDataDrawer({ title: '新浪微博', url: 'https://m.weibo.cn/', phone: false }),
              },
              {
                name: '网易云音乐',
                icon: <NeteaseIcon style={{ ...iconSize }} />,
                color: '#D8001A',
                click: () => setViewerDataDrawer({ title: '网易云音乐', url: 'https://y.music.163.com', phone: true }),
              },
              {
                name: '天天基金',
                icon: <FundsIcon style={{ ...iconSize }} />,
                color: '#EB5328',
                click: () => setViewerDataDrawer({ title: '天天基金', url: 'https://h5.1234567.com.cn/', phone: false }),
              },
              {
                name: 'Telegram',
                icon: <TelegramIcon style={{ ...iconSize }} />,
                color: '#30A9EE',
                click: () => setViewerDataDrawer({ title: 'Telegram', url: 'https://web.telegram.org/', phone: false }),
              },
              {
                name: '淘宝',
                icon: <TaobaoIcon style={{ ...iconSize }} />,
                color: '#EC5D2A',
                click: () => setViewerDataDrawer({ title: 'Github', url: 'https://main.m.taobao.com/', phone: false }),
              },
              {
                name: 'Github',
                icon: <GithubIcon style={{ ...iconSize }} />,
                color: '#24292f',
                click: () => setViewerDataDrawer({ title: 'Github', url: 'https://github.com/', phone: false }),
              },
              {
                name: 'bilibili',
                icon: <BilibiliIcon style={{ ...iconSize }} />,
                color: '#fb7299',
                click: () => setViewerDataDrawer({ title: 'bilibili', url: 'https://m.bilibili.com/', phone: true }),
              },
              {
                name: 'YouTube',
                icon: <YoutubeIcon style={{ ...iconSize }} />,
                color: '#E93223',
                click: () => setViewerDataDrawer({ title: 'Github', url: 'https://www.youtube.com/', phone: false }),
              },
              {
                name: 'IT之家',
                icon: <i style={{ ...iconSize }}>IT</i>,
                color: '#C1362D',
                click: () => setViewerDataDrawer({ title: 'IT之家', url: 'https://m.ithome.com/', phone: false }),
              },
              {
                name: '虎牙直播',
                icon: <i style={{ ...iconSize }}>虎</i>,
                color: '#E68131',
                click: () => setViewerDataDrawer({ title: '虎牙直播', url: 'https://m.huya.com/', phone: true }),
              },
            ],
          },
        ],
        keyword
      ),
    [keyword]
  );

  return (
    <CustomDrawerContent title="功能中心" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <div className={styles.search}>
          <Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            type="text"
            placeholder="功能名称"
            enterButton
            size="small"
          />
        </div>
        {apps}
        <CustomDrawer show={showManageFundDrawer}>
          <ManageFundContent
            onClose={closeManageFundDrawer}
            onEnter={() => {
              // freshFunds();
              closeManageFundDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageWalletDrawer}>
          <ManageWalletContent
            onClose={closeManageWalletDrawer}
            onEnter={() => {
              // freshFunds();
              closeManageWalletDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageZindexDrawer}>
          <ManageZindexContent
            onClose={closeManageZindexDrawer}
            onEnter={() => {
              // freshZindexs();
              closeManageZindexDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageStockDrawer}>
          <ManageStockContent
            onClose={closeManageStockDrawer}
            onEnter={() => {
              // freshStocks();
              closeManageStockDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageCoinDrawer}>
          <ManageCoinContent
            onClose={closeManageCoinDrawer}
            onEnter={() => {
              // freshCoins();
              closeManageCoinDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showFundFlowDrawer}>
          <FundFlowContent onClose={closeFundFlowDrawer} onEnter={closeFundFlowDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showFundsStatisticsDrawer}>
          <FundStatisticsContent onClose={closeFundStatisticsDrawer} onEnter={closeFundStatisticsDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showNewsDrawer}>
          <NewsContent onClose={closeNewsDrawer} onEnter={closeNewsDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showExchangeDrawer}>
          <ExchangeContent onClose={closeExchangeDrawer} onEnter={closeExchangeDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showQuoteCenterDrawer}>
          <QuoteCenterContent onClose={closeQuoteCenterDrawer} onEnter={closeQuoteCenterDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showHoldingDrawer}>
          <HoldingContent onClose={closeHoldingDrawer} onEnter={closeHoldingDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showViewerDataDrawer}>
          <ViewerContent {...viewerData} onClose={closeViewerDataDrawer} onEnter={closeViewerDataDrawer} />
        </CustomDrawer>
      </div>
    </CustomDrawerContent>
  );
};

export default AppCenterContent;
