import got from 'got';
import registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker(async function ({ url, config }: any) {
  try {
    const { body, rawBody } = await got(url, config);
    return { body, rawBody };
  } catch {
    return;
  }
});
