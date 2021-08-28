<p align="center">
<img src="https://github.com/1zilc/fishing-funds/blob/master/assets/icon.png" width="108">
</p>

# Fishing Funds

![GitHub release (latest by date)](https://img.shields.io/github/v/release/1zilc/fishing-funds)
![GitHub Release Date](https://img.shields.io/github/release-date/1zilc/fishing-funds)
![GitHub all releases](https://img.shields.io/github/downloads/1zilc/fishing-funds/total)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ee4fd509a7184f738eeb9048959b1f56)](https://app.codacy.com/gh/1zilc/fishing-funds?utm_source=github.com&utm_medium=referral&utm_content=1zilc/fishing-funds&utm_campaign=Badge_Grade_Settings)
[![Build](https://github.com/1zilc/fishing-funds/actions/workflows/publish.yml/badge.svg?branch=v4)](https://github.com/1zilc/fishing-funds/actions/workflows/publish.yml)
![GitHub top language](https://img.shields.io/github/languages/top/1zilc/fishing-funds?color=red)
![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/1zilc/fishing-funds/dev/electron/master)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/1zilc/fishing-funds/menubar)
<a href="https://qm.qq.com/cgi-bin/qm/qr?k=Su4GnbsicHvsPrbLMwNu557LyZQO19KZ&jump_from=webapi"><img src="https://img.shields.io/badge/QQ%E7%BE%A4-732268738-red" alt="QQ群" /></a>
![GitHub](https://img.shields.io/github/license/1zilc/fishing-funds)

> 基金、大盘、股票、虚拟货币状态栏显示小应用,支持 MacOS、Windows、Linux 客户端,数据源来自天天基金等

## 软件截图

<figure class="half">

<img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/1.png" width="25%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/2.png" width="25%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/3.png" width="25%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/4.png" width="25%"  />

</figure>

<figure class="half">

<img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/5.png" width="25%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/6.png" width="25%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/7.png" width="25%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/8.png" width="25%"  />

</figure>

## 项目介绍

- 本项目参考[electron-react-boilerplate-menubar](https://github.com/3on/electron-react-boilerplate-menubar)，基于[Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)  
  和[menubar](https://github.com/maxogden/menubar)开发
- 采用天天基金等数据源接口，实时显示当前基金涨跌情况，计算显示收益，大盘实时数据，板块行情，股票走势，加密虚拟货币等
- 软件中所有的数据仅供参考,一切收益或是亏损按当天实际为准
- 本项目是个人自用状态栏小插件，完全开源免费，喜欢的小伙伴 star 一下，如果觉得好用也可在软件中打赏支持:)
- 在使用中遇到 bug 欢迎[issues](https://github.com/1zilc/fishing-funds/issues)
- 如果有好的建议或改进欢迎 [PR](https://github.com/1zilc/fishing-funds/pulls)

## 数据源

> 注意 ⚠️：不同的数据源可能会有反爬机制，刷新时的请求速度会有所差异  
> 强烈建议使用天天基金的数据源，最快同时估值也最准确  
> 如果有好的数据源，欢迎[issues](https://github.com/1zilc/fishing-funds/issues)补充

- [天天基金](https://fund.eastmoney.com/) ★★★★★ (推荐)
- [腾讯证券](https://stockapp.finance.qq.com/mstats/) ★★★★☆
- [基金速查网](https://www.dayfund.cn/) ★★★☆☆
- [新浪基金](https://finance.sina.com.cn/fund/) ★★★★☆
- [好买基金](https://www.howbuy.com/fund/) ★★★☆☆
- [易天富](http://www.etf88.com/) ★★★☆☆

## 下载使用

- [官网下载](https://ff.1zilc.top)
- [Github 下载](https://github.com/1zilc/fishing-funds/releases)

> 注意 ⚠️：由于 Catalina 之后不支持 32 位程序，暂无 Windows32 位安装包，可自行下载源码打包

```bash
yarn package-win
```

> 注意 ⚠️：由于 MacOS 不允许打开未经 Apple 公证的程序，如果出现软件无法打开请进行以下操作

```bash
进入 「设置」- 「安全性与隐私」- 「通用」- 「允许从以下位置下载的App」-「仍然打开」
```

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

## 讨论交流

- QQ 群: [732268738](https://github.com/1zilc/fishing-funds/blob/master/screenshots/group1.jpg)
- issues: [#106](https://github.com/1zilc/fishing-funds/issues/106)

## 支持作者

| 微信                                                                                                               | 支付宝                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| <img src="https://github.com/1zilc/fishing-funds/blob/master/src/renderer/assets/qrcode/wechat.png" width="108" /> | <img src="https://github.com/1zilc/fishing-funds/blob/master/src/renderer/assets/qrcode/alipay.png" width="108" /> |

## 收录网站

- [柠檬精选](https://lemon.qq.com/lab/app/FishingFunds.html)
- [Electron Apps](https://www.electronjs.org/apps/fishing-funds)
- [MacWk](https://www.macwk.com/soft/fishing-funds)
- [马克喵](https://www.macat.vip/4257.html)
- [Mac 毒](https://www.macdo.cn/34786.html)

## 感谢

- [Jr Prévost](https://github.com/3on)
- [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [menubar](https://github.com/maxogden/menubar)
- [Ant Design](https://ant.design/index-cn)
- [ahooks](https://github.com/alibaba/hooks)
- [echarts](https://github.com/apache/echarts)

## 许可证

- [GPLv3](https://github.com/1zilc/fishing-funds/blob/master/LICENSE)
