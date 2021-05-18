<p align="center">
<img src="https://github.com/1zilc/fishing-funds/blob/master/assets/icon.png" width="108">
</p>

# Fishing Funds

![GitHub release (latest by date)](https://img.shields.io/github/v/release/1zilc/fishing-funds)
![GitHub Release Date](https://img.shields.io/github/release-date/1zilc/fishing-funds)
![GitHub all releases](https://img.shields.io/github/downloads/1zilc/fishing-funds/total)
![GitHub top language](https://img.shields.io/github/languages/top/1zilc/fishing-funds?color=red)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/1zilc/fishing-funds)
![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/1zilc/fishing-funds/dev/electron/v3)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/1zilc/fishing-funds/menubar)
![GitHub](https://img.shields.io/github/license/1zilc/fishing-funds)

> 显示基金涨跌状态栏小应用,数据源来自天天基金等

## 软件截图

<figure class="half">

<img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/1.png" width="33%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/2.png" width="33%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/3.png" width="33%"  />

</figure>

<figure class="half">

<img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/4.png" width="33%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/5.png" width="33%"  /><img src="https://github.com/1zilc/fishing-funds/blob/master/screenshots/6.png" width="33%"  />

</figure>

## 项目介绍

- 本项目参考[electron-react-boilerplate-menubar](https://github.com/3on/electron-react-boilerplate-menubar)，基于[Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)  
  和[menubar](https://github.com/maxogden/menubar)开发
- 采用天天基金等数据源接口，实时显示当前基金涨跌情况，计算显示收益，大盘实时数据，板块行情等
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
- [新浪基金](https://finance.sina.com.cn/fund/) ★★★☆☆
- [好买基金](https://www.howbuy.com/fund/) ★★★★☆
- [易天富](http://www.etf88.com/) ★★★★☆

## 下载使用

[官网下载](https://ff.1zilc.top)

[Github 下载](https://github.com/1zilc/fishing-funds/releases)

> 注意 ⚠️：由于 Catalina 之后不支持 32 位程序，暂无 Windows32 位安装包，可自行下载源码打包

```bash
yarn package-win
```

> 注意 ⚠️：由于 MacOS 不允许打开未经 Apple 公证的程序，如果出现软件无法打开请进行以下操作

```bash
进入 「设置」- 「安全性与隐私」- 「通用」- 「允许从以下位置下载的App」-「仍然打开」
```

## 支持一下～

#### 支付宝

<img src="https://github.com/1zilc/fishing-funds/blob/master/src/renderer/assets/qrcode/alipay.png" width="200px"  height="200px"/>

#### 微信

<img src="https://github.com/1zilc/fishing-funds/blob/master/src/renderer/assets/qrcode/wechat.png" width="200px"  height="200px"/>

## 感谢

[Jr Prévost](https://github.com/3on)  
[Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)  
[menubar](https://github.com/maxogden/menubar)  
[ahooks](https://github.com/alibaba/hooks)

## 许可证

GPLv3
