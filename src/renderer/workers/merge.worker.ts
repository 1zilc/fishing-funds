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

  const stateWithChached = Object.values(stateWithChachedCodeToMap);

  return stateWithChached;
}
