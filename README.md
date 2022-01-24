<p align="center">
<img src="https://download.1zilc.top/ff/icon.png" width="108">
</p>

# Fishing Funds

![GitHub release (latest by date)](https://img.shields.io/github/v/release/1zilc/fishing-funds)
[![fishing-funds](https://snapcraft.io/fishing-funds/badge.svg)](https://snapcraft.io/fishing-funds)
![GitHub Release Date](https://img.shields.io/github/release-date/1zilc/fishing-funds)
![GitHub all releases](https://img.shields.io/github/downloads/1zilc/fishing-funds/total)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ee4fd509a7184f738eeb9048959b1f56)](https://app.codacy.com/gh/1zilc/fishing-funds?utm_source=github.com&utm_medium=referral&utm_content=1zilc/fishing-funds&utm_campaign=Badge_Grade_Settings)
[![Build](https://github.com/1zilc/fishing-funds/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/1zilc/fishing-funds/actions/workflows/publish.yml)
![GitHub top language](https://img.shields.io/github/languages/top/1zilc/fishing-funds?color=red)
![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/1zilc/fishing-funds/dev/electron/main)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/1zilc/fishing-funds/menubar)
<a href="https://qm.qq.com/cgi-bin/qm/qr?k=Su4GnbsicHvsPrbLMwNu557LyZQO19KZ&jump_from=webapi"><img src="https://img.shields.io/badge/QQ%E7%BE%A4-732268738-red" alt="QQ群" /></a>
![GitHub](https://img.shields.io/github/license/1zilc/fishing-funds)

> 基金,大盘,股票,虚拟货币状态栏显示小应用,基于 Electron 开发,支持 MacOS,Windows,Linux 客户端,数据源来自天天基金,蚂蚁基金,爱基金,腾讯证券,新浪基金等

## 软件截图

<figure class="half">

<img src="https://download.1zilc.top/ff/screenshots/1.png" width="25%"  /><img src="https://download.1zilc.top/ff/screenshots/2.png" width="25%"  /><img src="https://download.1zilc.top/ff/screenshots/3.png" width="25%"  /><img src="https://download.1zilc.top/ff/screenshots/4.png" width="25%"  />

</figure>

<figure class="half">

<img src="https://download.1zilc.top/ff/screenshots/5.png" width="25%"  /><img src="https://download.1zilc.top/ff/screenshots/6.png" width="25%"  /><img src="https://download.1zilc.top/ff/screenshots/7.png" width="25%"  /><img src="https://download.1zilc.top/ff/screenshots/8.png" width="25%"  />

</figure>

## 项目介绍

- 本项目参考[electron-react-boilerplate-menubar](https://github.com/3on/electron-react-boilerplate-menubar)，基于[Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
  和[menubar](https://github.com/maxogden/menubar)开发
- 采用天天基金等数据源接口，实时显示当前基金涨跌情况，计算显示收益，大盘实时数据，板块行情，股票走势，加密虚拟货币等
- 软件中所有的数据仅供参考，一切收益或是亏损按当天实际为准，任何走势，排行数据均来自于第三方网站不代表作者观点
- 本项目是个人自用状态栏小插件，完全开源免费，仅供学习交流

## 数据源

> 注意 ⚠️：不同的数据源可能会有反爬机制，刷新时的请求速度会有所差异
> 强烈建议使用天天基金的数据源，最快同时估值也最准确

- [东方财富-天天基金](https://fund.eastmoney.com/) ★★★★★ (推荐)
- [支付宝-蚂蚁基金](https://www.fund123.cn/) ★★★★☆
- [同花顺-爱基金](http://fund.10jqka.com.cn/) ★★★★☆
- [腾讯证券](https://stockapp.finance.qq.com/mstats/) ★★★★☆
- [新浪基金](https://finance.sina.com.cn/fund/) ★★★★☆
- [基金速查网](https://www.dayfund.cn/) ★★★☆☆
- [好买基金](https://www.howbuy.com/fund/) ★★★☆☆
- [易天富](http://www.etf88.com/) ★★★☆☆

## 下载使用

> 注意 ⚠️：由于 MacOS 不允许打开未经 Apple 公证的程序，如果出现软件无法打开请进行以下操作 或[参考这里](https://github.com/1zilc/fishing-funds/issues/149)

```bash
进入 「设置」- 「安全性与隐私」- 「通用」- 「允许从以下位置下载的App」-「仍然打开」
```

- [官网下载](https://ff.1zilc.top)
- [阿里云网盘下载](https://alist.1zilc.top/Fishing%20Funds)
- [Github 下载](https://github.com/1zilc/fishing-funds/releases)
- [Homebrew 安装](https://formulae.brew.sh/cask/fishing-funds#default) `brew install --cask fishing-funds`

## 讨论交流

- QQ 群: [732268738](https://download.1zilc.top/ff/screenshots/group1.jpg)
- issues: [#106](https://github.com/1zilc/fishing-funds/issues/106)
- Telegram: [https://t.me/fishing_funds](https://t.me/fishing_funds)

## http 代理

由于众所周知的原因，部分接口无法访问，Fishing Funds 支持代理访问

| 选项         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 默认代理地址 | 例如 `http://127.0.0.1:1087`                                 |
| 默认代理规则 | 默认为 `api.coingecko.com,api.coincap.io`，不建议修改        |
| 白名单模式   | 默认关闭，开启后代理规则中的域名将不走代理，其余接口全部代理 |

## 导入导出

Fishing Funds 右键菜单支持导入导出基金 JSON 配置方便备份

```typescript
// 字段说明
interface FundSetting {
  code: string; // 基金代码（必填）
  name?: string; // 基金名称
  cyfe?: number; // 持有份额
  cbj?: number; // 持仓成本价
}
```

例子：

```json
[
  {
    "code": "320007",
    "name": "诺按成长混合",
    "cyfe": 1000.0,
    "cbj": 1.6988
  },
  {
    "code": "161725",
    "name": "招商中证白酒指数(LOF)",
    "cyfe": 1000.0,
    "cbj": 1.4896
  }
]
```

## 支持作者

作者利用空闲时间开发不易，您的支持可以给本项目的开发和完善提供巨大的动力，感谢对本软件的喜爱和认可:)

| 微信                                                                      | 支付宝                                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| <img src="https://download.1zilc.top/ff/qrcode/wechat.png" width="108" /> | <img src="https://download.1zilc.top/ff/qrcode/alipay.png" width="108" /> |

## 收录网站

- [柠檬精选](https://lemon.qq.com/lab/app/FishingFunds.html)
- [Electron Apps](https://www.electronjs.org/apps/fishing-funds)
- [MacWk](https://www.macwk.com/soft/fishing-funds)
- [Snap Store](https://snapcraft.io/fishing-funds)
- [Homebrew](https://formulae.brew.sh/cask/fishing-funds#default)

## 感谢

- [Jr Prévost](https://github.com/3on)
- [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [menubar](https://github.com/maxogden/menubar)
- [Ant Design](https://github.com/ant-design/ant-design/)
- [ahooks](https://github.com/alibaba/hooks)
- [echarts](https://github.com/apache/echarts)
- [Remix Icon](https://github.com/Remix-Design/RemixIcon)

## 许可证

- [GPLv3](https://github.com/1zilc/fishing-funds/blob/main/LICENSE)

## Star Charts

[![Stargazers over time](https://starchart.cc/1zilc/fishing-funds.svg)](https://starchart.cc/1zilc/fishing-funds)
