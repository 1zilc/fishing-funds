import store from '@/store';

const { requestProxy } = window.contextModules;

const request = async <T = any>(url: string, config = {}) => {
  const {
    setting: {
      systemSetting: { httpProxyAddressSetting, httpProxySetting, httpProxyWhitelistSetting, httpProxyRuleSetting },
    },
  } = store.getState();

  const httpProxyRuleMap = (httpProxyRuleSetting ?? '').split(',').reduce<Record<string, boolean>>((map, address: string) => {
    map[address] = true;
    return map;
  }, {});

  const { host } = new URL(url);

  const proxy =
    httpProxySetting && httpProxyWhitelistSetting !== !!httpProxyRuleMap[host]
      ? {
          http: httpProxyAddressSetting,
          https: httpProxyAddressSetting,
        }
      : undefined;

  return requestProxy<T>(url, { ...config, retry: 3, timeout: 7000 }, proxy);
};

export default request;
