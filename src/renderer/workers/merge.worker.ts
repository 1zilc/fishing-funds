// import registerPromiseWorker from 'promise-worker/register';
import { GetCodeMap } from '@/utils';

// registerPromiseWorker(mergeStateWithResponse);

export function mergeStateWithResponse<C, CK extends keyof C, SK extends keyof S, S, R extends S>(params: {
  config: C[];
  configKey: CK;
  stateKey: SK;
  state: S[];
  response: R[];
}) {
  const stateCodeToMap = GetCodeMap(params.state, params.stateKey);
  const responseCodeToMap = GetCodeMap(params.response, params.stateKey);

  const stateWithChachedCodeToMap = params.config.reduce<Record<string, S>>((map, current) => {
    const index = current[params.configKey] as unknown as string;
    const stateItem = stateCodeToMap[index];
    const responseItem = responseCodeToMap[index];
    if (stateItem || responseItem) {
      map[index] = { ...(stateItem || {}), ...(responseItem || {}) };
    }
    return map;
  }, {});

  const sortMap = params.state.reduce<Record<string, number>>((map, current, index) => {
    map[current[params.stateKey] as unknown as string] = index;
    return map;
  }, {});

  const stateWithChached = Object.values(stateWithChachedCodeToMap);

  stateWithChached.sort((a, b) => {
    return sortMap[a[params.stateKey] as unknown as string] < sortMap[b[params.stateKey] as unknown as string] ? -1 : 1;
  });

  return stateWithChached;
}
