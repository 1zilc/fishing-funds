<p align="center">
<img src="https://github.com/1zilc/fishing-funds/blob/main/build/icon.png?raw=true" width="128">
</p>

# Fishing Funds

![GitHub release (latest by date)](https://img.shields.io/github/v/release/1zilc/fishing-funds)
![GitHub Release Date](https://img.shields.io/github/release-date/1zilc/fishing-funds)
![GitHub all releases](https://img.shields.io/github/downloads/1zilc/fishing-funds/total)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ee4fd509a7184f738eeb9048959b1f56)](https://app.codacy.com/gh/1zilc/fishing-funds?utm_source=github.com&utm_medium=referral&utm_content=1zilc/fishing-funds&utm_campaign=Badge_Grade_Settings)
[![Build](https://github.com/1zilc/fishing-funds/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/1zilc/fishing-funds/actions/workflows/publish.yml)
![GitHub top language](https://img.shields.io/github/languages/top/1zilc/fishing-funds?color=red)
![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/1zilc/fishing-funds/dev/electron/main)
![Sandbox](https://img.shields.io/badge/sandbox-yes-blueviolet)
<a href="https://qm.qq.com/cgi-bin/qm/qr?k=Su4GnbsicHvsPrbLMwNu557LyZQO19KZ&jump_from=webapi"><img src="https://img.shields.io/badge/QQ%E7%BE%A4-732268738-red" alt="QQ群" /></a>
![GitHub](https://img.shields.io/github/license/1zilc/fishing-funds)
![Windows](https://img.shields.io/badge/-Windows-blue?logo=windows&logoColor=white)
![MacOS](https://img.shields.io/badge/-macOS-black?&logo=apple&logoColor=white)
![Linux](https://img.shields.io/badge/-Linux-yellow?logo=linux&logoColor=white)

> 基金,大盘,股票,虚拟货币状态栏显示小应用,基于 Electron 开发,支持 MacOS,Windows,Linux 客户端,数据源来自天天基金,蚂蚁基金,同花顺-爱基金,腾讯证券等

## 项目介绍

- 采用天天基金等数据源接口，实时显示当前基金涨跌情况，计算显示收益，大盘实时数据，板块行情，股票走势，加密虚拟货币等
- 软件中所有的数据仅供参考，一切收益或是亏损按当天实际为准，任何走势，排行数据均来自于第三方网站不代表作者观点
- 软件不收集上传ai相关功能的用户apikey，如有疑问请忽略ai功能
- 本项目是个人自用状态栏小插件，完全开源免费，仅供学习交流

## 数据源

> 注意 ⚠️：不同的数据源可能会有反爬机制，刷新时的请求速度会有所差异
> 强烈建议使用天天基金的数据源，最快同时估值也最准确

- [东方财富-天天基金](https://fund.eastmoney.com/) ★★★★★ (推荐)
- [支付宝-蚂蚁基金](https://www.fund123.cn/) ★★★☆☆
- [同花顺-爱基金](http://fund.10jqka.com.cn/) ★★★☆☆
- [腾讯证券](https://stockapp.finance.qq.com/mstats/) ★★★☆☆

## 下载使用

> 注意 ⚠️：由于 macOS 不允许打开未签名的程序，如果出现软件无法打开请进行以下操作 或[参考这里](https://github.com/1zilc/fishing-funds/issues/149)

```bash
# 终端执行
sudo xattr -d com.apple.quarantine "/Applications/Fishing Funds.app"
```

```bash
# 安全设置
进入 「设置」- 「安全性与隐私」- 「通用」- 「允许从以下位置下载的App」-「仍然打开」
```

- [官网下载](https://ff.1zilc.top)
- [Homebrew 安装](https://formulae.brew.sh/cask/fishing-funds#default) `brew install --cask fishing-funds`
- WinGet 安装 `winget install Fishing Funds`

> 旧版系统

- [windows 7/8 下载](https://github.com/1zilc/fishing-funds/releases/tag/v7.0.2)
- [macOS 10.13/10.14 下载](https://github.com/1zilc/fishing-funds/releases/tag/v8.1.0)
- [macOS 10.15 下载](https://github.com/1zilc/fishing-funds/releases/tag/v8.2.3)
- [macOS 11 下载](https://github.com/1zilc/fishing-funds/releases/tag/v8.5.1)

## 讨论交流

- QQ 群: [732268738](https://download.1zilc.top/ff/screenshots/group1.jpg)
- Issue: [#106](https://github.com/1zilc/fishing-funds/issues/106)

## AI

FIshing Funds 支持 OpenAI Compatibility 接口用于基金一键录入等，不会收集上传用户 apikey，如有疑问请忽略 ai 相关功能

- 基金导入（推荐模型 Grok4、Gemini 2.5 pro、 Qwen2.5vl:32b 及以上）

## 系统代理

- 由于众所周知的原因，部分货币接口无法访问，Fishing Funds 已适配系统代理访问
- 支持 http 代理、socks 代理
- 自行将以下货币接口加入自己的代理软件规则中，并重启 Fishing Funds

```
api.coingecko.com
api.coincap.io
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

## AI 识别录入
Fishing Funds支持AI识别截图导入数据，确保模型具有vision功能，推荐gpt-4o、grok4、gemini2.5-pro、qwen2.5vl:32b及更好的大模型。
> 注意 ⚠️：请确保接口地址的安全性，本软件不保证识别过程中的数据不会泄露至第三方，使用时请确保完全了解该功能

- 使用openai兼容接口，在设置-AI中配置请求地址与apikey
- 进入某宝-理财-总资产-我的资产-全部持有
- 长截图，保证暴露基金名称、持有收益、累计收益三项数据
  

## 配置同步

- 设置中开启后自动存储配置文件至指定路径，启动时优先读取该路径配置
- 通过 iCloud、OneDrive 等方式自动同步该文件至云端实现多台设备配置同步
- 支持钱包，基金，指数，板块，股票，货币，h5 配置同步

## 支持作者

作者利用空闲时间开发不易，您的支持可以给本项目的开发和完善提供巨大的动力，感谢对本软件的喜爱和认可:)

| 微信                                                                      | 支付宝                                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| <img src="https://download.1zilc.top/ff/qrcode/wechat.png" width="108" /> | <img src="https://download.1zilc.top/ff/qrcode/alipay.png" width="108" /> |

## 收录网站

- [柠檬精选](https://lemon.qq.com/lab/app/FishingFunds.html)
- [Electron Apps](https://www.electronjs.org/apps/fishing-funds)
- [MacWk](https://www.macwk.com/soft/fishing-funds)
- [Homebrew](https://formulae.brew.sh/cask/fishing-funds#default)
- [Awesome Mac](https://github.com/jaywcjlove/awesome-mac)
- [WinGet](https://github.com/microsoft/winget-pkgs)

## 感谢

- [Jr Prévost](https://github.com/3on)
- [electron-vite](https://github.com/alex8088/electron-vite)
- [menubar](https://github.com/maxogden/menubar)
- [Ant Design](https://github.com/ant-design/ant-design/)
- [ahooks](https://github.com/alibaba/hooks)
- [echarts](https://github.com/apache/echarts)
- [Remix Icon](https://github.com/Remix-Design/RemixIcon)

## 许可证

- [GPLv3](https://github.com/1zilc/fishing-funds/blob/main/LICENSE)

## Star Charts

[![Stargazers over time](https://starchart.cc/1zilc/fishing-funds.svg)](https://starchart.cc/1zilc/fishing-funds)
