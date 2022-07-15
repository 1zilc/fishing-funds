import got from 'got';
import Proxy from '../proxy';
import registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker(async function ({ url, config, proxyConent }: any) {
  try {
    const { httpAgent, httpsAgent } = new Proxy(proxyConent, url);
    const { body, rawBody } = await got(url, {
      ...config,
      retry: {
        limit: 2,
      },
      timeout: {
        request: 10000,
      },
      agent: {
        http: httpAgent,
        https: httpsAgent,
      },
    });
    return { body, rawBody };
  } catch {
    return;
  }
});
