import { batch } from 'react-redux';
import store from '@/store';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

export const defaultWebConfig = [
  {
    title: '新浪微博',
    url: 'https://m.weibo.cn/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://m.weibo.cn/favicon.ico',
  },
  {
    title: 'Telegram',
    url: 'https://web.telegram.org/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://web.telegram.org/k/assets/img/favicon.ico',
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://www.youtube.com/s/desktop/04fe8437/img/favicon_96x96.png',
  },
  {
    title: '东财人气榜',
    url: 'https://vipmoney.eastmoney.com/collect/stockranking/pages/ranking9_3/list.html',
    iconType: Enums.WebIconType.First,
    color: '#b16ce0',
  },
  {
    title: '虎牙直播',
    url: 'https://m.huya.com/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://diy-assets.msstatic.com/mobile/favicon.ico',
  },
];

export function GetWebConfig() {
  const {
    web: {
      config: { webConfig },
    },
  } = store.getState();
  const codeMap = GetCodeMap(webConfig);

  return { webConfig, codeMap };
}

export function GetCodeMap(config: Web.SettingItem[]) {
  return config.reduce((r, c, i) => {
    r[c.url] = c;
    return r;
  }, {} as Web.CodeMap);
}
