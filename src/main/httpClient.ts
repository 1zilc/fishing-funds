import { Agent, request, Dispatcher } from 'undici';
import { createHash, randomBytes } from 'crypto';
import dayjs from 'dayjs';

export type RequestConfig = {
  responseType?: 'json' | 'text' | 'arraybuffer';
  headers?: Record<string, string>;
  searchParams?: Record<string, any>;
  method?: Dispatcher.RequestOptions['method'];
  body?: Dispatcher.RequestOptions['body'];
};
export type HttpResponse<T> = {
  body: T;
  headers: Dispatcher.RequestOptions['headers'];
};

export default class HttpClient {
  private static agent = new Agent({
    connect: { keepAlive: true },
  });
  public userAgent?: string;
  public dispatcher?: Dispatcher;
  private static secret = randomBytes(16).toString('hex');

  public async request(url: string, config?: Omit<RequestConfig, 'responseType'>): Promise<HttpResponse<string>>;
  public async request(url: string, config?: RequestConfig & { responseType: 'text' }): Promise<HttpResponse<string>>;
  public async request(url: string, config?: RequestConfig & { responseType: 'arraybuffer' }): Promise<HttpResponse<ArrayBuffer>>;
  public async request<Res = unknown>(url: string, config?: RequestConfig & { responseType: 'json' }): Promise<HttpResponse<Res>>;
  public async request(url: string, config?: RequestConfig) {
    try {
      const host = new URL(url).host;
      const headers = {
        'User-Agent': this.userAgent,
        'Host': host,
        ...config?.headers,
      } as Record<string, string>;

      // FIXME // 此处为东方财富添加的cookie验证逻辑，未来随时可能会变更
      if (host.includes('eastmoney.com')) {
        const key = dayjs().format('YYYY-MM-DD-HH'); // 每小时更换一次
        const nid = createHash('md5').update(`${HttpClient.secret}-${key}`).digest('hex');
        headers['Cookie'] = `nid=${nid}`;
      }

      const res = await request(url, {
        headers,
        body: config?.body,
        method: config?.method,
        query: config?.searchParams,
        dispatcher: this.dispatcher || HttpClient.agent,
      });
      if (config?.responseType === 'json') {
        return {
          body: await res.body.json(),
          headers: res.headers,
        };
      } else if (config?.responseType === 'arraybuffer') {
        return {
          body: await res.body.arrayBuffer(),
          headers: res.headers,
        };
      } else {
        return {
          body: await res.body.text(),
          headers: res.headers,
        };
      }
    } catch (e) {
      return {} as any;
    }
  }
}
